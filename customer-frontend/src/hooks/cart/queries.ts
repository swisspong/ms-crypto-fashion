import { getMyCarts } from "@/src/services/cart.service";
import { useQuery } from "@tanstack/react-query";


export const useMyCart = (enabled = true) => {
    return useQuery(["cart"], () => getMyCarts(), {
        enabled: enabled
    });
};
