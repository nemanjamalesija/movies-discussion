import type { UserType } from './userType'

export type CommentType = {
  author: UserType
  text: string
  _id: string
}

export type PostType = {
  _id: string
  text: string
  image: string
  author: UserType
  likes: UserType[] | []
  comments: CommentType[]
  createdAt: string
}
