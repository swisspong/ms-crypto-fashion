import { getMyCarts } from "@/src/services/cart.service";
import { useQuery } from "@tanstack/react-query";


export const useMyCart = () => {
    return useQuery(["cart"], () => getMyCarts());
};
