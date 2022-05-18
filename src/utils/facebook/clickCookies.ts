import type puppeteer from 'puppeteer'
import delay from '../delay'

const clickCookies = async (page: puppeteer.Page) => {
  try {
    // Await for the cookie popup to appear
    await delay(5000)
    await page.click(
      'div[role="dialog"] > div:not(:first-child) > div > div:not(:first-child) div[role="button"]',
    )
  } catch (e) {
    console.log('Ignored cookies')
  }
}

export default clickCookies
