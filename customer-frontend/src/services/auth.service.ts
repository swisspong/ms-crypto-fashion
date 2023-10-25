import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.AUTH })

export const signout = async (): Promise<void> => {
    await api.post(`/auth/signout`).then(
        (response) => response.data
    );
};
export const signin = async (body: ISigninPayload): Promise<void> => {
    const result = await api.post(`/auth/signin`, body).then(
        (response) => response.data
    );
    return result;
};
export const signinMetamask = async (body: ISigninMetamaskPayload): Promise<void> => {
    const result = await api.post(`/auth/signin/metamask`, body).then(
        (response) => response.data
    );
    return result;
};
export const signup = async (body: ISignupPayload): Promise<void> => {

    const result = await api.post(`/auth/signup`, body).then(
        (response) => response.data
    );
    return result;
};

export const getNonce = async (): Promise<{ nonce: string }> => {
    const result = await api.get(`/auth/nonce`).then(
        (response) => response.data
    );
    return result;
}

