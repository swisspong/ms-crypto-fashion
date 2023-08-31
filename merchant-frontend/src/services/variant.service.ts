import { API } from "@/lib/utils";


export const upsertVariants = async (data: { prodId: string, body: IVariantPayload }): Promise<void> => {
    await API.post(`/products/${data.prodId}/variant_groups`, data.body).then(
        (response) => response.data
    );
};
export const putVariant = async (data: { prodId: string, vrntId: string, body: IAdvancedVariant }): Promise<void> => {
    await API.patch(`/products/${data.prodId}/variants/${data.vrntId}`, data.body).then(
        (response) => response.data
    );
};