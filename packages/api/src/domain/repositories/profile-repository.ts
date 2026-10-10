import type { Profile } from '@kaggle-competition-finder/schemas'

export type ProfileRepository = {
  find: () => Promise<Profile | null>
  save: (profile: Profile) => Promise<Profile>
}
