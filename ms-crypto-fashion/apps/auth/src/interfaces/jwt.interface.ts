export interface JwtPayload {
    sub: string
    // email: string
    merchant?:string
    role: string
    permission: string[]
}