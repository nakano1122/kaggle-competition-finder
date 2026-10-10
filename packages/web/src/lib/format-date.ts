const dateFormatter = new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium' })
const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const parseDate = (value: string | null) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

export const formatDate = (value: string | null) => {
  const date = parseDate(value)

  return date ? dateFormatter.format(date) : (value ?? '未定')
}

export const formatDateTime = (value: string) => {
  const date = parseDate(value)

  return date ? dateTimeFormatter.format(date) : value
}
