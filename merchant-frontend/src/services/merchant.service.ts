import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import { IMerchantRes } from "../types/user";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.MERCHANT })
export const startMerchant = async (body: IMerchantStartPayload): Promise<void> => {
    await api.post(`/merchants/start`, body).then(
        (response) => response.data
    );
};
export const credentialMerchant = async (body: ICredentialPayload): Promise<void> => {
    await api.post(`/merchants/credential`, body).then(
        (response) => response.data
    );
};
export const editMerchantProfile = async (body: IMerchantProfilePayload): Promise<void> => {
    await api.patch(`/merchants/profile`, body).then(
        (response) => response.data
    );
};

export const getMerchantCredential = async (): Promise<IMerchantRes> => {
    return await api.get(`/merchants/credential`).then(
        (response) => response.data
    );
};