interface ISigninPayload {
    email: string
    password: string
}

interface ISigninResponse {
    id: string
    email: string
    username: string
    accessToken:string
}
