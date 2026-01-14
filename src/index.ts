import puppeteer from 'puppeteer'

require('dotenv').config({ path: '.env' })

import clickCookies from './utils/facebook/clickCookies'
import getLatestPost from './utils/facebook/getLatestPost'
import parsePostTimestamp from './utils/facebook/parsePostTimestamp'
import auth from './utils/googleapi/auth'
import lunchToCalendarEventMapper from './utils/mappers/lunchToCalendarEventMapper'
import delay from './utils/delay'
import getCalendarLunches from './utils/googleapi/getCalendarLunches'
import { WEEK_DAYS } from './types/lunch'
import filterEventsByCalendarSummary from './utils/googleapi/filterEventsByCalendarSummary'

const _initBrowser = async (): Promise<[puppeteer.Browser, puppeteer.Page]> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800,
  })
  return [browser, page]
}

const main = async () => {
  if (!process.env.FACEBOOK_PAGE_URL) {
    throw new Error(`Not configured 'FACEBOOK_PAGE_URL' env`)
  }
  const googleAuth = auth()
  const { data } = await getCalendarLunches(googleAuth)

  if (filterEventsByCalendarSummary(data.items).length === 1) {
    console.log('All week set! No need for more scraping!')
    return 1
  }

  // --- scraping magic

  const [browser, page] = await _initBrowser()

  await page.goto(process.env.FACEBOOK_PAGE_URL, {
    waitUntil: 'networkidle2',
  })

  await clickCookies(page)
  const { postText, postImage, postTimestamp } = await getLatestPost(page)
  
  // Check if the post is fresh (posted today)
  if (postTimestamp) {
    const { isFresh, timeAgo } = parsePostTimestamp(postTimestamp)
    console.log(`Post timestamp: ${timeAgo}`)
    
    if (!isFresh) {
      console.log('Post is not fresh (not from today). Skipping...')
      await browser.close()
      return 0
    }
    console.log('Post is fresh, proceeding with scraping...')
  } else {
    console.warn('Could not find post timestamp, proceeding with caution...')
  }
  
  // Get element's textContent, it will parse literally everything into one string.
  // Emoticons are ignored
  const value: string | undefined = await page.evaluate(
    (el) => el.textContent,
    postText,
  )
  const imageSrc =
    (await postImage?.evaluate((image) => image.getAttribute('src'))) ?? null

  if (!value) {
    throw new Error('No text found in the latest article')
  }

  await browser.close()

  // ---

  // Log it in case of later debugging
  console.log('---')
  console.log('Found this post content:')
  console.log(value)
  console.log('---')

  let mappedMenu

  try {
    const _weekDay = Object.values(WEEK_DAYS)[new Date().getDay() - 1]
    mappedMenu = {
      [_weekDay]: {
        date: new Date(),
        description: value.slice(57).split('  Na miejscu')[0], // calculated offset, it should be somewhat automatic
      },
    }
  } catch (e) {
    if (typeof data.items?.length === 'number' && data.items?.length > 0) {
      console.warn(`This post probably didn't contained a lunch menu :c`)
      return
    } else {
      throw new Error(`Whoosh! They forgot or the scraping didn't work`)
    }
  }

  const googleClient = await googleAuth.auth.getClient()

  let numberOfAddedLunches = 0

  for (const lunch in mappedMenu) {
    const _lunch = mappedMenu[lunch as WEEK_DAYS]
    if (_lunch) {
      // // Check if exist in the calendar
      // const itemInCalendar = data.items?.find((event) => {
      //   if (
      //     event.start?.dateTime?.slice(0, 10) ===
      //     format(_lunch.date, 'yyyy-MM-dd')
      //   ) {
      //     return event
      //   }
      //   return undefined
      // })
      //
      // if (itemInCalendar) {
      //   continue
      // }
      numberOfAddedLunches = numberOfAddedLunches + 1

      const event = lunchToCalendarEventMapper(_lunch, {
        description: `${_lunch.description}\n${imageSrc ?? ''}`,
      })

      googleAuth.calendar.events.insert({
        auth: googleClient,
        calendarId: googleAuth.GOOGLE_CALENDAR_ID,
        requestBody: event,
      })
      await delay(500)
    }
  }

  if (numberOfAddedLunches > 0) {
    console.log(`Added ${numberOfAddedLunches} lunches!`)
  } else {
    console.log('All good!')
  }
  console.log('Bon Appétit!')
  return 1
}

main()
