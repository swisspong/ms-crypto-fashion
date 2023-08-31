interface IOrderRecentSale {
    merchant: IMerchant
    totalAmount: number
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