import type { UserType } from './userType'

export type Post = {
  id: string
  text: string
  image: string
  author: UserType
  friends: UserType | []
  friendRequests: UserType | []
}
