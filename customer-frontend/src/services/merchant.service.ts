import {  SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import queryString from "query-string";
const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.MERCHANT })
export const getMerchantById = async (mchtId: string): Promise<IMerchant> => {
    return await api.get(`/merchants/${mchtId}`).then(
        (response) => response.data
    );
};

