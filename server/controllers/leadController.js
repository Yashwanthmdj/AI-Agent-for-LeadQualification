import { getDb, admin } from '../config/db.js'
import { triggerBolnaCall } from '../services/bolnaService.js'

function classifyLead({ budget, timeline }) {
  const b = Number(budget || 0)
  const t = String(timeline || '').trim().toLowerCase()

  if (b > 50000 && t === 'urgent') return 'Hot'
  if (b > 20000) return 'Warm'
  return 'Cold'
}

function isValidPhone(phone) {
  if (typeof phone !== 'string') return false
  const trimmed = phone.trim()
  // permissive: allows +, digits, spaces, hyphens
  return /^[+]?[\d\s-]{8,20}$/.test(trimmed)
}

function normalizeOutboundPhone(phoneRaw) {
  if (typeof phoneRaw !== 'string') return null
  const trimmed = phoneRaw.trim()
  if (!trimmed) return null

  // keep leading + if present, strip other non-digits
  const hasPlus = trimmed.startsWith('+')
  const digitsOnly = trimmed.replace(/[^\d]/g, '')

  if (!digitsOnly) return null

  // If user provided + already, trust it (E.164-ish) as long as length is plausible
  if (hasPlus) {
    if (digitsOnly.length < 8 || digitsOnly.length > 15) return null
    return `+${digitsOnly}`
  }

  // If no +, try to apply default country code (seamless UX)
  // Example: DEFAULT_COUNTRY_CODE=+91 and phone=9398884972 -> +919398884972
  const defaultCc = String(process.env.DEFAULT_COUNTRY_CODE || '+91').trim()
  const ccDigits = defaultCc.replace(/[^\d]/g, '')
  if (!ccDigits) return null

  // Common India case: 10-digit mobile number
  if (digitsOnly.length === 10) {
    return `+${ccDigits}${digitsOnly}`
  }

  // If user already typed country code but forgot '+', accept 11-15 digits total
  if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
    return `+${digitsOnly}`
  }

  return null
}

function normalizeBudget(value) {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return 0
  const cleaned = value.replace(/[^\d.]/g, '')
  const num = Number(cleaned)
  return Number.isFinite(num) ? num : 0
}

function extractWebhookFields(payload) {
  // Bolna payload shapes can vary; support common naming variants.
  const name =
    payload?.name ??
    payload?.lead?.name ??
    payload?.customer?.name ??
    payload?.contact?.name ??
    ''

  const phone =
    payload?.phone ??
    payload?.lead?.phone ??
    payload?.customer?.phone ??
    payload?.contact?.phone ??
    payload?.to ??
    ''

  const requirement =
    payload?.requirement ??
    payload?.lead?.requirement ??
    payload?.data?.requirement ??
    payload?.summary?.requirement ??
    payload?.notes ??
    ''

  const budgetRaw =
    payload?.budget ??
    payload?.lead?.budget ??
    payload?.data?.budget ??
    payload?.summary?.budget ??
    0

  const timeline =
    payload?.timeline ??
    payload?.lead?.timeline ??
    payload?.data?.timeline ??
    payload?.summary?.timeline ??
    ''

  return {
    name: String(name || '').trim(),
    phone: String(phone || '').trim(),
    requirement: String(requirement || '').trim(),
    budget: normalizeBudget(budgetRaw),
    timeline: String(timeline || '').trim(),
  }
}

export async function startCall(req, res, next) {
  try {
    const { phone } = req.body || {}
    if (!isValidPhone(phone)) return res.status(400).json({ success: false, error: 'Invalid phone' })

    const normalizedPhone = normalizeOutboundPhone(phone)
    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone. Use E.164 format like +919876543210 (or provide a 10-digit Indian number).',
      })
    }

    const bolnaResponse = await triggerBolnaCall({ phone: normalizedPhone })
    return res.status(200).json({ success: true, message: 'Call started', data: bolnaResponse })
  } catch (err) {
    const status = Number(err?.response?.status || err?.statusCode || err?.status || 500)
    const bolnaMsg =
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      null

    if (bolnaMsg) {
      console.error('startCall error (bolna):', { status, bolnaMsg })
      return res.status(status).json({ success: false, error: String(bolnaMsg) })
    }

    console.error('startCall error:', err?.response?.data || err)
    return next(err)
  }
}

export async function bolnaWebhook(req, res, next) {
  try {
    const payload = req.body || {}
    console.log('Webhook received:', JSON.stringify(payload)?.slice(0, 2000))

    const { name, phone, requirement, budget, timeline } = extractWebhookFields(payload)
    const status = classifyLead({ budget, timeline })

    const db = getDb()
    const lead = {
      name,
      phone,
      requirement,
      budget: Number(budget || 0),
      timeline,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    const docRef = await db.collection('leads').add(lead)

    return res.status(200).json({
      success: true,
      message: 'Lead stored',
      id: docRef.id,
      status,
    })
  } catch (err) {
    console.error('bolnaWebhook error:', err?.response?.data || err)
    return next(err)
  }
}

export async function getLeads(_req, res, next) {
  try {
    const db = getDb()
    const snapshot = await db.collection('leads').orderBy('createdAt', 'desc').get()
    const leads = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    return res.status(200).json({ success: true, leads })
  } catch (err) {
    console.error('getLeads error:', err)
    return next(err)
  }
}

export async function getLeadById(req, res, next) {
  try {
    const { id } = req.params
    const db = getDb()
    const doc = await db.collection('leads').doc(id).get()
    if (!doc.exists) return res.status(404).json({ success: false, error: 'Lead not found' })
    return res.status(200).json({ success: true, lead: { id: doc.id, ...doc.data() } })
  } catch (err) {
    console.error('getLeadById error:', err)
    return next(err)
  }
}

export async function deleteLeadById(req, res, next) {
  try {
    const { id } = req.params
    const db = getDb()
    const ref = db.collection('leads').doc(id)
    const doc = await ref.get()
    if (!doc.exists) return res.status(404).json({ success: false, error: 'Lead not found' })
    await ref.delete()
    return res.status(200).json({ success: true, message: 'Lead deleted' })
  } catch (err) {
    console.error('deleteLeadById error:', err)
    return next(err)
  }
}

