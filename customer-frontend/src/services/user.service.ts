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

export const verifyEmail = async (token: string): Promise<IStatus> => {
    return apiSsr.get(`/auth/email/verify?token=${token}`, {
    }).then(
        (response) => response.data
    );
}

export const updateProfileCommon = async (body: IProfilePayload): Promise<void> => {
    return apiCsr.patch(`users`, body).then(
        (response) => response.data
    )
}

export const changeEmil = async (body: IEmailPayload): Promise<IStatus> => {
    return apiCsr.post(`users/email`, body).then(
        (response) => response.data
    )
}


export const changeEmailUser = async (token: string): Promise<IStatus> => {
    return apiSsr.get(`users/email?token=${token}`, {
    }).then(
        (response) => response.data
    );
}

export const changePasswordUser = async (data: IPasswordPayload): Promise<IStatus> => {
    return apiCsr.patch(`users/password`, data).then(
        (response) => response.data
    );
}

export const sendResetPassword = async (body: IEmailPayload): Promise<IStatus> => {
    return apiCsr.post(`users/password/reset`, body).then(
        (response) => response.data
    )
}

export const checkResetPassword = async (token: string): Promise<IStatus> => {
    return apiSsr.get(`users/password/reset?token=${token}`, {
    }).then(
        (response) => response.data
    );
}

export const resetPassword = async (token: string, data: IResetPassPayload): Promise<IStatus> => {
    return apiCsr.patch(`users/password/reset?token=${token}`, data).then(
        (response) => response.data
    );
}