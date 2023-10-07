interface ISigninPayload {
    email: string,
    password: string
}
interface ISigninMetamaskPayload {
    signedMessage: string
    message: string
    address: string
}
interface ISignupPayload {
    email: string
    username: string
    password: string
}

