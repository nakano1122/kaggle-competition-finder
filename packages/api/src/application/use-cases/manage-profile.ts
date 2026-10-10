import type { ResearchAndDevelopmentExperience } from '@/domain/entities/research-and-development-experience'
import type { ProfileRepository } from '@/domain/repositories/profile-repository'

export const getProfile = (repository: ProfileRepository) => {
  return repository.find()
}

export const updateProfile = (
  experience: ResearchAndDevelopmentExperience,
  repository: ProfileRepository,
): Promise<ResearchAndDevelopmentExperience> => {
  return repository.save(experience)
}
