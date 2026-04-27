import axios from 'axios'

// Bolna outbound call API (per docs): POST https://api.bolna.ai/call
const DEFAULT_BOLNA_API_URL = 'https://api.bolna.ai/call'

function requiredEnv(name) {
  const val = process.env[name]
  if (!val) {
    const err = new Error(`Missing required env var: ${name}`)
    err.statusCode = 500
    throw err
  }
  return val
}

export async function triggerBolnaCall({ phone }) {
  const apiKey = requiredEnv('BOLNA_API_KEY')
  const agentId = requiredEnv('BOLNA_AGENT_ID')
  const webhookUrl = requiredEnv('WEBHOOK_URL')

  const url = process.env.BOLNA_API_URL || DEFAULT_BOLNA_API_URL

  const payload = {
    agent_id: agentId,
    recipient_phone_number: phone,
    // Some Bolna setups configure webhooks at the agent level. Including this field is harmless if supported.
    webhook_url: webhookUrl,
  }

  console.log('Triggering Bolna call:', { phone, agentId, webhookUrl: webhookUrl?.slice(0, 40) + '...' })

  const authorizationHeader = apiKey.toLowerCase().startsWith('bearer ') ? apiKey : `Bearer ${apiKey}`

  const resp = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorizationHeader,
    },
    timeout: 30_000,
  })

  return resp.data
}

