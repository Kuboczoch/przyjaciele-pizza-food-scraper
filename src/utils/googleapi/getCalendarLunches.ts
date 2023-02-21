import startOfToday from 'date-fns/startOfToday'
import endOfToday from 'date-fns/endOfToday'

import type auth from './auth'
import type { GaxiosPromise } from 'googleapis-common'
import type { calendar_v3 } from 'googleapis'

const getCalendarLunches = async (
  googleAuth: ReturnType<typeof auth>,
): Promise<GaxiosPromise<calendar_v3.Schema$Events>> => {
  return googleAuth.calendar.events.list({
    calendarId: googleAuth.GOOGLE_CALENDAR_ID,
    orderBy: 'startTime',
    timeMin: startOfToday().toISOString(),
    timeMax: endOfToday().toISOString(),
    singleEvents: true,
    maxResults: 10,
  })
}

export default getCalendarLunches
