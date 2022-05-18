import format from 'date-fns/format'

import type { TLunch } from '../../types/lunch'
import type { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3'

const lunchToCalendarEventMapper = (
  lunch: TLunch,
): calendar_v3.Schema$Event => {
  return {
    summary: 'Cafe Planet Lunch',
    description: lunch.description,
    start: {
      dateTime: `${format(lunch.date, 'yyyy-MM-dd')}T13:00:00`,
      timeZone: 'Europe/Warsaw',
    },
    end: {
      dateTime: `${format(lunch.date, 'yyyy-MM-dd')}T13:05:00`,
      timeZone: 'Europe/Warsaw',
    },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 1 }],
    },
  }
}

export default lunchToCalendarEventMapper
