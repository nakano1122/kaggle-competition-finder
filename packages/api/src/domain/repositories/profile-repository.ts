import type { ResearchAndDevelopmentExperience } from '@/domain/entities/research-and-development-experience'

export type ProfileRepository = {
  find: () => Promise<ResearchAndDevelopmentExperience | null>
  save: (
    experience: ResearchAndDevelopmentExperience,
  ) => Promise<ResearchAndDevelopmentExperience>
}
