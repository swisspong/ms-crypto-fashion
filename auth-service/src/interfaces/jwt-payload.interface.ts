export interface JwtPayload {
    sub: string
    merchant?:string
    role: string
    permission: string[]
}