import { API_AUTH } from "@/lib/utils"

export const signin = async (body: ISigninPayload): Promise<void> => {
    const result = await API_AUTH.post(`auth/signin/admin`, body).then(
        (response) => response.data
    )

    return result
}

export const signout = async (): Promise<void> => {
    await API_AUTH.post(`auth/signout`).then(
        (response) => response.data
    );
};

export const getInfoSsr = async (cookie: string | undefined): Promise<ISigninResponse> => {
    return API_AUTH.get(`users/me`, {
        headers: { cookie },
        withCredentials: true,
    }).then(
        (response) => response.data
    );
};

export const getInfoCsr = async (): Promise<ISigninResponse> => {
    const response = await API_AUTH.get(`users/me`);
    const { user_id, email, username } = response.data;

    return { id: user_id, email, username, accessToken: '' }
};
