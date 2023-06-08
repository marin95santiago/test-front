import { User } from "../schemas/user.schema"

export default function userMapper(user: any | unknown): User {
  return {
    id: user.id ?? '',
    username: user.username ?? '',
    password: user.password ?? '',
    permissions: user.permissions ?? [''],
    token: user.token ?? ''
  }
}
