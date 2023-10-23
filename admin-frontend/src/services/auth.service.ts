import {SERVICE_FORMAT, dynamicApi} from "@/lib/utils"
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.AUTH })
const apiSsr = dynamicApi({ ssr: true, service: SERVICE_FORMAT.USER })
const apiCsr = dynamicApi({ ssr: false, service: SERVICE_FORMAT.USER })

export const signin = async (body: ISigninPayload): Promise<void> => {
    const result = await api.post(`auth/signin/admin`, body).then(
        (response) => response.data
    )

    return result
}

export const signout = async (): Promise<void> => {
    await api.post(`auth/signout`).then(
        (response) => response.data
    );
};

export const getInfoSsr = async (cookie: string | undefined): Promise<ISigninResponse> => {
    return apiSsr.get(`users/me`, {
        headers: { cookie },
        withCredentials: true,
    }).then(
        (response) => response.data
    );
};

export const getInfoCsr = async (): Promise<ISigninResponse> => {
    const response = await apiCsr.get(`users/me`);
    const { user_id, email, username } = response.data;

    return { id: user_id, email, username, accessToken: '' }
};
