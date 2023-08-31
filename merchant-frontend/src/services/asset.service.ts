import { API } from "@/lib/utils";



export const postAsset = async (data: FormData): Promise<{ image_url: string }> => {
    return API.post(`/assets`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    }).then(
        (response) => response.data
    );
};
export const postAssetBanner = async (data: FormData): Promise<{ image_url: string }> => {
    return API.post(`/assets/banner`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    }).then(
        (response) => response.data
    );
};
