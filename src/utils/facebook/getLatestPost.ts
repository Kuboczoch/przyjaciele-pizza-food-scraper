import type puppeteer from 'puppeteer'

const getLatestPost = async (page: puppeteer.Page) => {
  try {
    await page.evaluate(`(async() => {
    [...document.querySelectorAll(
      'div[role="article"] div[role="button"]',
    )].find((element) => element.textContent === 'See more').click()
  })()`)

    const postText = await page.$(
      'div[role="article"] div[data-ad-comet-preview]',
    )

    if (!postText) {
      throw new Error()
    }

    const postImage =
      (await page.$('div[role="article"] a[href*="photo"] img')) ?? null

    // Extract post timestamp from the aria-label attribute
    const postTimestamp = await page.$eval(
      'div[role="article"] a[role="link"][aria-label]',
      (el) => el.getAttribute('aria-label'),
    )

    return {
      postImage,
      postText,
      postTimestamp: postTimestamp ?? null,
    }
  } catch (e) {
    throw new Error('Cannot find latest article')
  }
}

export default getLatestPost
