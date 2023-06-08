export interface User {
  id: string
  username: string
  password?: string
  permissions: string[]
  token?: string
}

export interface UserContextType {
  userContext: User;
  setUserContext: (value: User) => void;
}