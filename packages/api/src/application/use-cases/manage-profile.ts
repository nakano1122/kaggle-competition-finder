import type { Profile } from '@kaggle-competition-finder/schemas'
import type { ProfileRepository } from '../../domain/repositories/profile-repository'

export const getProfile = (repository: ProfileRepository) => {
  return repository.find()
}

export const updateProfile = (
  content: string,
  updatedAt: string,
  repository: ProfileRepository,
): Promise<Profile> => {
  return repository.save({ content, updatedAt })
}
