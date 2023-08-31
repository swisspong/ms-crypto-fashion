import { getMerchantProducts, getMyStoreFront, getProductStorefrontById } from "@/src/services/product.service";
import { useQuery } from "@tanstack/react-query";



export const useMerchantProducts = (data: { mchtId: string, pagination: { page: number, per_page: number } }) => {
    return useQuery(["product-merchants", data.pagination], () => getMerchantProducts(data), {
        keepPreviousData: true
    });
};
export const useMyStorefront = (data: { page: number, per_page: number, catIds: string[], search?: string }) => {
    return useQuery(["my-products", data], () => getMyStoreFront(data), {
        keepPreviousData: true
    });
};
export const useOneProductStorefront = (prodId?: string) => {
    return useQuery(["my-product", prodId], () => getProductStorefrontById(prodId!), {
        enabled: prodId ? true : false
    });
};