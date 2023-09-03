import { getMerchantCredential } from "@/src/services/merchant.service";
import { useQuery } from "@tanstack/react-query";


export const useGetMerchantCredential = () => {
    return useQuery(["merchant-credential"], () => getMerchantCredential());
};