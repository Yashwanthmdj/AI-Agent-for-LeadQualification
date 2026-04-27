import admin from 'firebase-admin'

let firestore = null

function getPrivateKeyFromEnv() {
  const key = process.env.FIREBASE_PRIVATE_KEY
  if (!key) return undefined
  // Firestore keys often come with literal "\n" sequences in env vars
  return key.replace(/\\n/g, '\n')
}

export function getDb() {
  if (firestore) return firestore

  if (!admin.apps.length) {
    // If GOOGLE_APPLICATION_CREDENTIALS is set, prefer ADC explicitly.
    // This prevents accidentally using an invalid FIREBASE_PRIVATE_KEY value.
    const projectIdFromEnv = process.env.FIREBASE_PROJECT_ID
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // With ADC, explicitly set projectId when provided to avoid ambiguous resolution.
      admin.initializeApp(projectIdFromEnv ? { projectId: projectIdFromEnv } : undefined)
      console.log('Initialized Firebase Admin via application default credentials (GOOGLE_APPLICATION_CREDENTIALS)')
    } else {
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = getPrivateKeyFromEnv()

      const looksLikePem = typeof privateKey === 'string' && privateKey.includes('BEGIN PRIVATE KEY')

      if (projectId && clientEmail && looksLikePem) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
      console.log('Initialized Firebase Admin via env credentials')
      } else {
        admin.initializeApp()
        console.log('Initialized Firebase Admin via application default credentials')
      }
    }
  }

  firestore = admin.firestore()
  return firestore
}

export { admin }

