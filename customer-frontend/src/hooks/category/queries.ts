import { getAllCategoryByMerchantId, getCategorieMain, getMyCategories } from "@/src/services/category.service";
import { getMyStoreFront } from "@/src/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useMyCagories = (data: { page: number, per_page: number }) => {
    return useQuery(["my-categories", data], () => getMyCategories(data), {
        keepPreviousData: true
    });
};
export const useCategoriesMain = (data: { page: number, per_page: number }) => {
    return useQuery(["categories-main", data], () => getCategorieMain(data), {
        keepPreviousData: true
    });
};
export const useCategoryByMchtId = (data: { mchtId: string | string[] | undefined, pagination: { page: number, per_page: number } }) => {
    return useQuery(["categories", data.pagination], () => getAllCategoryByMerchantId(data), {
        keepPreviousData: true,
        enabled: !!data.mchtId
    });
};