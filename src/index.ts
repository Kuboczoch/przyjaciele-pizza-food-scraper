import puppeteer from 'puppeteer'

import clickCookies from './clickCookies'

const main = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto('https://www.facebook.com/CafePlanetWierna/', {
    waitUntil: 'networkidle2',
  })
  await page.setViewport({
    width: 1200,
    height: 800,
  })
  await page.screenshot({ path: 'screen.png' })
  await clickCookies(page)

  await page.evaluate(`(async() => {
    [...document.querySelectorAll(
      'div[role="article"] div[role="button"]',
    )].find((element) => element.textContent === 'See more').click()
  })()`)

  const element = await page.$('div[role="article"] div[data-ad-comet-preview]')
  const value = await page.evaluate((el) => el.textContent, element)
  console.log(value)

  await browser.close()
}

main()
