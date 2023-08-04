import type { PostFeed } from './postType'

export type UserType = {
  _id: string
  firstName: string
  lastName: string
  email?: string
  photo: string
  friendRequests?: UserType[]
  friends?: UserType[]
  posts?: PostFeed[]
  role?: string
  active?: boolean
}
