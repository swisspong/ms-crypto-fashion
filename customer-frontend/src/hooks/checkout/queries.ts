import { getCheckoutById } from "@/src/services/checkout.service";
import { useQuery } from "@tanstack/react-query";


export const useGetCheckoutById = (chktId?: string) => {
    return useQuery(["checkout", chktId], () => getCheckoutById(chktId), {
        enabled: chktId ? true : false
    });
};
