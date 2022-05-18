import type { TLunchMenu } from '../../types/lunch'
import { WEEK_DAYS, weekDays } from '../../types/lunch'

/**
 * @param text for example 20.05
 */
const _daysToDate = (text: string): Date => {
  const [day, month] = text.split('.')

  if (!day || !month) {
    throw new Error('Invalid date provided')
  }
  const year = new Date().getFullYear()
  return new Date(`${year}-${month}-${day}`)
}

const menuMapper = (menu: string): TLunchMenu => {
  const lunchMenu: TLunchMenu = {
    [WEEK_DAYS.MONDAY]: null,
    [WEEK_DAYS.TUESDAY]: null,
    [WEEK_DAYS.WEDNESDAY]: null,
    [WEEK_DAYS.THURSDAY]: null,
    [WEEK_DAYS.FRIDAY]: null,
  }

  try {
    const splitMenu = menu.split('|')

    splitMenu.forEach((menuLine, index) => {
      for (const weekDay in weekDays) {
        const _weekDay = weekDay as WEEK_DAYS
        if (
          weekDays[_weekDay].some((day) =>
            menuLine.toLowerCase().includes(day.toLowerCase()),
          )
        ) {
          let mealDescription = menuLine.slice(1)
          mealDescription = menuLine.slice(mealDescription.indexOf(' ') + 2)
          if (_weekDay !== WEEK_DAYS.FRIDAY) {
            mealDescription = mealDescription.slice(
              0,
              mealDescription.length - 6,
            )
          }
          // day can be obtained from the previous record
          const previousMenuLine = splitMenu[index - 1]
          const date = _daysToDate(
            previousMenuLine.slice(
              previousMenuLine.length - 6,
              previousMenuLine.length - 1,
            ),
          )
          lunchMenu[_weekDay] = { date: date, description: mealDescription }
        }
      }
    })
  } catch (e) {
    throw new Error(`Couldn't parse lunch menu string\n${e}`)
  }

  return lunchMenu
}

export default menuMapper
