import { API, SERVICE_FORMAT, dynamicApi, ssrApi } from "@/lib/utils";
const apiSsr = dynamicApi({ ssr: true, service: SERVICE_FORMAT.USER })
const apiCsr = dynamicApi({ ssr: false, service: SERVICE_FORMAT.USER })
export const getInfoSsr = async (cookie: string | undefined): Promise<IUserRes> => {
    console.log('cookie', cookie)
    return apiSsr.get(`/users/me`, {
        headers: { cookie },
        withCredentials: true,
    }).then(
        (response) => response.data
    );
};

export const getInfoCsr = async (): Promise<IUserRes> => {
    return await apiCsr.get(`/users/me`).then(
        (response) => response.data
    );
};

export const verifyEmail = async (token: string): Promise<IVerify> => {


    return apiSsr.get(`/auth/email/verify?token=${token}`, {
    }).then(
        (response) => response.data
    );

}
