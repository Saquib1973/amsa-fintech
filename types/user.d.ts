export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  type: UserRole
  isVerified: boolean
}
