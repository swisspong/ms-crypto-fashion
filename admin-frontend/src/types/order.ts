interface IOrderRecentSale {
    mcht_name: string
    totalAmount: number
    mcht_id: string
}
interface IOrderTrade {
    month: string
    totalSales: number
    totalOrders: number
}

interface IRecentSaleResponse {
    page: number,
    per_page: number,
    total: number,
    total_page: number,
    data: IOrderRecentSale[]
}