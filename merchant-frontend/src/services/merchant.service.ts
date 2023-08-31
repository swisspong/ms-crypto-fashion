import { API } from "@/lib/utils";

export const startMerchant = async (body: IMerchantStartPayload): Promise<void> => {
    await API.post(`/merchants/start`, body).then(
        (response) => response.data
    );
};
export const credentialMerchant = async (body: ICredentialPayload): Promise<void> => {
    await API.post(`/merchants/credential`, body).then(
        (response) => response.data
    );
};
export const editMerchantProfile = async (body: IMerchantProfilePayload): Promise<void> => {
    await API.patch(`/merchants/profile`, body).then(
        (response) => response.data
    );
};