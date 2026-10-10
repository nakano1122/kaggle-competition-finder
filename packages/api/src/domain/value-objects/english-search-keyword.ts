export type EnglishSearchKeyword = {
  value: string
}

const maximumKeywordCount = 3
const maximumKeywordLength = 200

const isEnglishSearchKeyword = (
  keyword: EnglishSearchKeyword | undefined,
): keyword is EnglishSearchKeyword => keyword !== undefined

export const createEnglishSearchKeyword = (
  value: string,
): EnglishSearchKeyword | undefined => {
  const normalizedValue = value.trim()

  if (normalizedValue.length === 0) {
    return undefined
  }

  if (normalizedValue.length > maximumKeywordLength) {
    return undefined
  }

  return { value: normalizedValue }
}

export const createEnglishSearchKeywords = (
  values: string[],
): EnglishSearchKeyword[] | undefined => {
  if (values.length === 0 || values.length > maximumKeywordCount) {
    return undefined
  }

  const keywords = values.map(createEnglishSearchKeyword)

  if (!keywords.every(isEnglishSearchKeyword)) {
    return undefined
  }

  return keywords
}
