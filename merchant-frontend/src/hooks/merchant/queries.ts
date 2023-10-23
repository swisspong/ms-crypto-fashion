import { getMerchantById, getMerchantCredential } from "@/src/services/merchant.service";
import { useQuery } from "@tanstack/react-query";


export const useGetMerchantCredential = () => {
    return useQuery(["merchant-credential"], () => getMerchantCredential());
};

export const useMerchantById = (mchtId?: string) => {
    return useQuery(["merchant", mchtId], () => getMerchantById(mchtId!), {
        enabled: mchtId ? true : false
    });
};