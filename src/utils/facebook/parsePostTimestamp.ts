/**
 * Parses Facebook post timestamp and determines if the post is fresh (posted today)
 * @param timestampText The aria-label text from the Facebook post timestamp link
 * @returns Object with parsed date and whether the post is fresh
 */
const parsePostTimestamp = (
  timestampText: string,
): { isFresh: boolean; timeAgo: string } => {
  const now = new Date()
  const trimmedText = timestampText.trim()

  // Check for "Just Now" or similar immediate posts
  if (trimmedText.toLowerCase().includes('just now')) {
    return { isFresh: true, timeAgo: trimmedText }
  }

  // Check for hours ago (e.g., "22h", "1h ago", "1h")
  const hoursMatch = trimmedText.match(/^(\d+)\s*h/)
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1], 10)
    // Consider posts fresh if they are from today (less than 24 hours and still same day context)
    // For lunch posts between 9am-1pm, we want same-day posts only
    const isFresh = hours < 12 // Within 12 hours is reasonable for "fresh" lunch posts
    return { isFresh, timeAgo: trimmedText }
  }

  // Check for minutes ago (e.g., "1m ago", "1m", "30m")
  const minutesMatch = trimmedText.match(/^(\d+)\s*m/)
  if (minutesMatch) {
    return { isFresh: true, timeAgo: trimmedText }
  }

  // Check for "Yesterday" - definitely not fresh
  if (trimmedText.toLowerCase().includes('yesterday')) {
    return { isFresh: false, timeAgo: trimmedText }
  }

  // Check for days ago (e.g., "2d ago", "2d")
  const daysMatch = trimmedText.match(/^(\d+)\s*d/)
  if (daysMatch) {
    return { isFresh: false, timeAgo: trimmedText }
  }

  // Check for specific dates (e.g., "December 1, 2025")
  // If it's a specific date format, it's likely old
  const dateMatch = trimmedText.match(/^[A-Za-z]+\s+\d+,?\s+\d{4}/)
  if (dateMatch) {
    return { isFresh: false, timeAgo: trimmedText }
  }

  // Default: if we can't parse it, consider it not fresh to be safe
  console.warn(`Unable to parse timestamp: "${timestampText}"`)
  return { isFresh: false, timeAgo: trimmedText }
}

export default parsePostTimestamp
