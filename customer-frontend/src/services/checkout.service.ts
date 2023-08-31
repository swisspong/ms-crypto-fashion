import { API } from "@/lib/utils";

export const postCheckout = async (body: ICheckoutPayload): Promise<ICheckout> => {
    return await API.post(`/checkouts`, body).then(
        (response) => response.data
    );
};

export const getCheckoutById = async (chktId?: string): Promise<ICheckout> => {
    return await API.get(`/checkouts/${chktId}`).then(
        (response) => response.data
    );
};
