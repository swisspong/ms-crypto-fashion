import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import { id } from "ethers";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.ADDRESS })
export const postAddress = async (body: IAddressPayload): Promise<void> => {
    return await api.post(`/address`, body).then(
        (response) => response.data
    );
};

export const patchAddress = async (body: {id: string, data: IAddressPayload}): Promise<void> => {
    return await api.patch(`/address/${body.id}`, body.data).then(
        (response) => response.data
    )
}

export const deleteAddress = async (id: string): Promise<void> => {
    return await api.delete(`/address/${id}`).then(
        (response) => response.data
    )
}

export const getAddress = async (): Promise<IAddress[]> => {
    return await api.get(`/address`).then(
        (response) => response.data
    );
};
