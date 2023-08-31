import { API } from "@/lib/utils";


export const signout = async (): Promise<void> => {
    await API.post(`/auth/signout`).then(
        (response) => response.data
    );
};
export const signin = async (body: ISigninPayload): Promise<void> => {
    const result = await API.post(`/auth/signin`, body).then(
        (response) => response.data
    );
    return result;
};
export const signinMetamask = async (body: ISigninMetamaskPayload): Promise<void> => {
    const result = await API.post(`/auth/signin/metamask`, body).then(
        (response) => response.data
    );
    return result;
};
export const signup = async (body: ISignupPayload): Promise<void> => {
    const result = await API.post(`/auth/signup`, body).then(
        (response) => response.data
    );
    return result;
};

export const getNonce = async (): Promise<{ nonce: string }> => {
    const result = await API.get(`/auth/nonce`).then(
        (response) => response.data
    );
    return result;
}
