import { getCategorieMain, getCategories, getCategoryById } from "@/src/services/category.service";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (data: { page: number, per_page: number }) => {
    return useQuery(["categories", data], () => getCategories(data), {
        keepPreviousData: true
    });
};
export const useCategoriesMain = (data: { page: number, per_page: number }) => {
    return useQuery(["categories-main", data], () => getCategorieMain(data), {
        keepPreviousData: true
    });
};
export const useCategoryById = (catId: string) => {
    return useQuery(["category", catId], () => getCategoryById(catId));
};