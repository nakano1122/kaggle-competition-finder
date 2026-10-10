export type ResearchAndDevelopmentExperience = {
  content: string
  updatedAt: string
}

export type ResearchAndDevelopmentExperienceInput =
  ResearchAndDevelopmentExperience

export const createResearchAndDevelopmentExperience = (
  input: ResearchAndDevelopmentExperienceInput,
): ResearchAndDevelopmentExperience | undefined => {
  const content = input.content.trim()

  if (content.length === 0) {
    return undefined
  }

  return { ...input, content }
}
