import { format, differenceInDays } from 'date-fns'

export default function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds === 0) {
    return 'Just now'
  }

  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = differenceInDays(now, date)
  if (days <= 4) {
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  // If it's more than 4 days, display the actual date in the format "YYYY-MM-DD"
  return format(date, 'yyyy-MM-dd')
}
