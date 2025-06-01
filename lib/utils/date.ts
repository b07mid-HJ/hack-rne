export function parseDate(date: string | Date): Date {
  if (date instanceof Date) {
    return date
  }
  return new Date(date)
}

export function formatTimestamp(timestamp: string | Date): string {
  const date = parseDate(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return "Hier"
  if (days < 7) return `Il y a ${days} jours`
  return date.toLocaleDateString()
}

export function formatMessageTime(timestamp: string | Date): string {
  const date = parseDate(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
