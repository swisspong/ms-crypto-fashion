import { getCategories, getCategoryById } from "@/src/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";



export const useCategories = (data: { pageIndex: number, pageSize: number }) => {
    return useQuery(["categories", data], () => getCategories (data), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        keepPreviousData: true
    });
};
export const useCategoryById = (catweb_id: string) => {
    return useQuery(["category", catweb_id], () => getCategoryById(catweb_id));
};