import { API_ORDER } from "@/lib/utils";

export const getDashboardTrade = async (): Promise<IOrderTrade[]> => {
    return await API_ORDER.get(`orders/dashboard/trade`).then((response) => response.data)
}

export const getDashboardRecentSale = async (data: { pageIndex: number, pageSize: number }): Promise<IRecentSaleResponse> => {
    return await API_ORDER.get(`orders/dashboard/sales?per_page=${data.pageSize}&page=${data.pageIndex + 1}`).then((response) => response.data)
}