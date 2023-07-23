import type { UserType } from './userType'

export type PostFeed = {
  id: string
  text: string
  image: string
  author: UserType
  likes: UserType[] | []
  comments: UserType[] | []
  createdAt: string
}
