import { getAdminById, getAllAdmin } from "@/src/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useGetAllAdmin = (data: { pageIndex: number, pageSize: number }) => {
    return useQuery(["admin", data], () => getAllAdmin (data), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        keepPreviousData: true
    });
};

export const useGetAdminById =  (id: string | string[] | undefined) => {
    return  useQuery(["admin", id], () => getAdminById(id!), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        enabled: !!id
    });
};