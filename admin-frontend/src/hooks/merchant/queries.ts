import { getAllMerchantApproves, getAllMerchants, getDashboardMerchant, getMerchantById } from "@/src/services/merchant.service";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { error } from "console";

export const useGetAllMerchantApproves = (data: { pageIndex: number, pageSize: number }) => {
    return useQuery(["merchantsapp", data], () => getAllMerchantApproves(data), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        keepPreviousData: true
    });
};

export const useGetAllMerchant = (data: { pageIndex: number, pageSize: number }) => {
    return useQuery(["merchants", data], () => getAllMerchants(data), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        keepPreviousData: true
    });
};


export const useGetMerchantById =  (id: string | string[] | undefined) => {
    return  useQuery(["merchant", id], () => getMerchantById(id!), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        enabled: !!id
    });
};

export const useGetDashboardMerchant = () => {
    return useQuery(['dashboardMerchant'], () => getDashboardMerchant(), {
        onError: (error: AxiosError) => {
            console.log(error)
        }
    })
}