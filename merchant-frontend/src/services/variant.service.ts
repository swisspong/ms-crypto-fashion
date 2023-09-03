import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";

const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.PRODUCT })
export const upsertVariants = async (data: { prodId: string, body: IVariantPayload }): Promise<void> => {
    await api.post(`/products/${data.prodId}/variant_groups`, data.body).then(
        (response) => response.data
    );
};
export const putVariant = async (data: { prodId: string, vrntId: string, body: IAdvancedVariant }): Promise<void> => {
    await api.patch(`/products/${data.prodId}/variants/${data.vrntId}`, data.body).then(
        (response) => response.data
    );
};