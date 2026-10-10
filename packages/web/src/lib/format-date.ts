export const formatDate = (value: string | null) => {
  if (!value) {
    return '未定'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium' }).format(date)
}
