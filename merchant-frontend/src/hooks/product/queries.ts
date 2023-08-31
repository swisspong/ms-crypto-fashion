import { getProductById, getProducts } from "@/src/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProducts = (data: { page: number, per_page: number }) => {
    return useQuery(["products", data], () => getProducts(data), {
        keepPreviousData: true
    });
};
export const useProductById = (prodId: string) => {
    return useQuery(["product", prodId], () => getProductById(prodId), { enabled: prodId ? true : false, cacheTime: 0 });
};