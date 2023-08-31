import { getDashboardRecentSale, getDashboardTrade } from "@/src/services/order.service"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetOrderTradeByMonth = () => {
    return useQuery(['orderTrade'], () => getDashboardTrade(), {
        onError: (error: AxiosError) => {
            console.log(error)
        }
    })
}

export const useGetOrderRecentSale = (data: {pageIndex: number, pageSize: number}) => {
    return useQuery(['orderRecent', data], () => getDashboardRecentSale(data), {
        onError: (error: AxiosError) => {
            console.log(error)
        },
        keepPreviousData: true
    })
}

