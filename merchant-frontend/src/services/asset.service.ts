import {  SERVICE_FORMAT, dynamicApi } from "@/lib/utils";

const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.PRODUCT })

export const postAsset = async (data: FormData): Promise<{ image_url: string }> => {
    return api.post(`/assets`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    }).then(
        (response) => response.data
    );
};
export const postAssetBanner = async (data: FormData): Promise<{ image_url: string }> => {
    return api.post(`/assets/banner`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    }).then(
        (response) => response.data
    );
};
