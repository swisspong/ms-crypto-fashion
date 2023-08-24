export interface UserJwtPayload {
    sub: string
    merchant?: string
    role: string
    permission: string[]
}