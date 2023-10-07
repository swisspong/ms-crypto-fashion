import { getMerchantProducts, getProductById, getProducts, getProductsMerchants } from "@/src/services/product.service";
import { SearchType } from "@/src/types/enums/product";
import { useQuery } from "@tanstack/react-query";


export const useMerchantProducts = (data: { mchtId: string | string[] | undefined, page: number, per_page: number, catIds: string[], search?: string }) => {
    return useQuery(["product-merchants", data], () => getMerchantProducts(data), {
        keepPreviousData: true,
        enabled:!!data.mchtId
    });
};
export const useProductById = (prodId?: string) => {
    return useQuery(["product", prodId], () => getProductById(prodId!), {
        enabled: prodId ? true : false
    });
};

export const useProducts = (data: { page: number, per_page: number, catIds: string[], search?: string, type_search: string }) => {
    return useQuery(["products", data], () => getProducts(data), {
        enabled: data.type_search === SearchType.PRODUCT
    });
}
export const useProductsMerchants = (data: { page: number, per_page: number, catIds: string[], search?: string, type: string, type_search: string | undefined }) => {
    return useQuery(["products-merchants", data], () => getProductsMerchants(data), {
        enabled: data.type === SearchType.MERCHANT
    });
}
