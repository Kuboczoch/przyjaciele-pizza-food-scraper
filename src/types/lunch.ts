export enum WEEK_DAYS {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
}

// Days object with array of names in case of misspelling
export const weekDays: { [key in WEEK_DAYS]: string[] } = {
  [WEEK_DAYS.MONDAY]: ['PONIEDZIAŁEK'],
  [WEEK_DAYS.TUESDAY]: ['WTOREK'],
  [WEEK_DAYS.WEDNESDAY]: ['ŚRODA'],
  [WEEK_DAYS.THURSDAY]: ['CZWARTEK'],
  [WEEK_DAYS.FRIDAY]: ['PIĄTEK'],
}

export type TLunch = {
  date: Date
  description: string
}

export type TLunchMenu = {
  [key in WEEK_DAYS]: TLunch | null
}
