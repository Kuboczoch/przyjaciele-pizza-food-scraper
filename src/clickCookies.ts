import type puppeteer from 'puppeteer'
import delay from './utils/delay'

const clickCookies = async (page: puppeteer.Page) => {
  await delay(5000)
  await page.click(
    'div[role="dialog"] > div:not(:first-child) > div > div:not(:first-child) div[role="button"]',
  )
}

export default clickCookies
