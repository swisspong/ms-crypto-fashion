import { getProductAll } from "@/src/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProductAll = (data: { page: number, per_page: number ,search?: string }) => {
    return useQuery(["my-products", data], () => getProductAll(data), {
        keepPreviousData: true
    });
};