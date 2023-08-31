import { API } from "@/lib/utils";
import queryString from "query-string";

export const getMerchantById = async (mchtId: string): Promise<IMerchant> => {
    return await API.get(`/merchants/${mchtId}`).then(
        (response) => response.data
    );
};

