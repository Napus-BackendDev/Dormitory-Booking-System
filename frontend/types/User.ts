import { Role } from "./Role"

export type User = {
    id: string
    email: string
    name: string
    password: string
    createdAt: Date
    roleId?: string
    role?: Role
}