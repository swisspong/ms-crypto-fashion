import { SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
const api = dynamicApi({ssr: false, service: SERVICE_FORMAT.ORDER})
export const getDashboardTrade = async (): Promise<IOrderTrade[]> => {
    return await api.get(`orders/dashboard/trade`).then((response) => response.data)
}

export const getDashboardRecentSale = async (data: { pageIndex: number, pageSize: number }): Promise<IRecentSaleResponse> => {
    return await api.get(`orders/dashboard/sales?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data)
}