import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import { IUserRes } from "../types/user";
const apiSsr = dynamicApi({ ssr: true, service: SERVICE_FORMAT.USER })
const apiCsr = dynamicApi({ ssr: false, service: SERVICE_FORMAT.USER })
export const getInfoSsr = async (cookie: string | undefined): Promise<IUserRes> => {
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