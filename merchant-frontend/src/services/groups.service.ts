import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";

const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.PRODUCT })
export const postGroup = async (data: { prodId: string, body: IGroup}): Promise<void> => {
    await api.post(`/products/${data.prodId}/variant_groups`, data.body).then(
        (response) => response.data
    );
};
export const patchGroup = async (data: { prodId: string, body: IGroup}): Promise<void> => {
    await api.patch(`/products/${data.prodId}/variant_groups`, data.body).then(
        (response) => response.data
    );
};