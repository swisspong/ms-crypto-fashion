import { API } from "@/lib/utils";
import { id } from "ethers";

export const postAddress = async (body: IAddressPayload): Promise<void> => {
    return await API.post(`/address`, body).then(
        (response) => response.data
    );
};

export const patchAddress = async (body: {id: string, data: IAddressPayload}): Promise<void> => {
    return await API.patch(`/address/${body.id}`, body.data).then(
        (response) => response.data
    )
}

export const deleteAddress = async (id: string): Promise<void> => {
    return await API.delete(`/address/${id}`).then(
        (response) => response.data
    )
}

export const getAddress = async (): Promise<IAddress[]> => {
    return await API.get(`/address`).then(
        (response) => response.data
    );
};
