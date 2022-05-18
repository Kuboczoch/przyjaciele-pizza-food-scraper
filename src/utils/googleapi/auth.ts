import { google } from 'googleapis'

const auth = () => {
  const SCOPES = process.env.GOOGLE_SCROPE
  const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
  const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER
  const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID

  if (
    !SCOPES ||
    !GOOGLE_PRIVATE_KEY ||
    !GOOGLE_CLIENT_EMAIL ||
    !GOOGLE_PROJECT_NUMBER ||
    !GOOGLE_CALENDAR_ID
  ) {
    throw new Error('Google API not configured')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    projectId: GOOGLE_PROJECT_NUMBER,
    scopes: SCOPES,
  })

  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY,
    SCOPES,
  )

  const calendar = google.calendar({
    version: 'v3',
    auth: jwtClient,
  })

  return {
    auth,
    calendar,
    SCOPES,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PROJECT_NUMBER,
    GOOGLE_CALENDAR_ID,
  }
}

export default auth
