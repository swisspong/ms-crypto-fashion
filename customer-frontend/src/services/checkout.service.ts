import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.CHECKOUT })
export const postCheckout = async (body: ICheckoutPayload): Promise<ICheckout> => {
    return await api.post(`/checkouts`, body).then(
        (response) => response.data
    );
};

export const getCheckoutById = async (chktId?: string): Promise<ICheckout> => {
    return await api.get(`/checkouts/${chktId}`).then(
        (response) => response.data
    );
};
