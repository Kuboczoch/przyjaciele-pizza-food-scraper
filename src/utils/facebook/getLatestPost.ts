import type puppeteer from 'puppeteer'

interface LatestPostResult {
  postImage: puppeteer.ElementHandle<Element> | null
  postText: puppeteer.ElementHandle<Element>
  postTimestamp: string | null
}

const getLatestPost = async (page: puppeteer.Page): Promise<LatestPostResult> => {
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
    // Try to find the timestamp link within the article
    let postTimestamp: string | null = null
    try {
      postTimestamp = await page.$eval(
        'div[role="article"] a[role="link"][aria-label][href*="posts"]',
        (el) => el.getAttribute('aria-label'),
      )
    } catch (e) {
      // If the specific selector fails, try a more general approach
      console.warn('Could not find post timestamp with primary selector')
    }

    return {
      postImage,
      postText,
      postTimestamp,
    }
  } catch (e) {
    throw new Error('Cannot find latest article')
  }
}

export default getLatestPost
