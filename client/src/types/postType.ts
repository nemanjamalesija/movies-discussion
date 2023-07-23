import type { UserType } from './userType'

export type PostFeed = {
  id: string
  text: string
  image: string
  author: UserType
  friends: UserType | []
  friendRequests: UserType | []
  createdAt: string
}
