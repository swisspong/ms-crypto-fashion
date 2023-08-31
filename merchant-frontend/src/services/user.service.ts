import { API, ssrApi } from "@/lib/utils";
import { IUserRes } from "../types/user";

export const getInfoSsr = async (cookie: string | undefined): Promise<IUserRes> => {
    return ssrApi.get(`/users/me`, {
        headers: { cookie },
        withCredentials: true,
    }).then(
        (response) => response.data
    );
};

export const getInfoCsr= async (): Promise<IUserRes> => {
    return await API.get(`/users/me`).then(
        (response) => response.data
    );
};