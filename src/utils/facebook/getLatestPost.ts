import type puppeteer from 'puppeteer'

const getLatestPost = async (page: puppeteer.Page) => {
  try {
    await page.evaluate(`(async() => {
    [...document.querySelectorAll(
      'div[role="article"] div[role="button"]',
    )].find((element) => element.textContent === 'See more').click()
  })()`)

    const element = await page.$(
      'div[role="article"] div[data-ad-comet-preview]',
    )

    if (!element) {
      throw new Error()
    }

    return element
  } catch (e) {
    throw new Error('Cannot find latest article')
  }
}

export default getLatestPost
