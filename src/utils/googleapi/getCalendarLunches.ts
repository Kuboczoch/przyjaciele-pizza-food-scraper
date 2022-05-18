import startOfWeek from 'date-fns/startOfWeek'
import endOfWeek from 'date-fns/endOfWeek'

import type auth from './auth'
import type { GaxiosPromise } from 'googleapis-common'
import type { calendar_v3 } from 'googleapis'

const getCalendarLunches = async (
  googleAuth: ReturnType<typeof auth>,
): Promise<GaxiosPromise<calendar_v3.Schema$Events>> => {
  return googleAuth.calendar.events.list({
    calendarId: googleAuth.GOOGLE_CALENDAR_ID,
    orderBy: 'startTime',
    timeMin: startOfWeek(new Date()).toISOString(),
    timeMax: endOfWeek(new Date()).toISOString(),
    singleEvents: true,
    maxResults: 10,
  })
}

export default getCalendarLunches
