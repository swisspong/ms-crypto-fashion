interface IMerchant {
    _id: string
    mcht_id: string
    name: string
    status: string
    banner_title: string
    first_name: string
    id_card_img: string
    banner_url: string
    last_name: string
    amount: number
}

interface IMerchantResponse {
    page: number,
    per_page: number,
    total: number,
    total_page: number,
    data: IMerchant[]
}

interface IMerchantPayload {
    name: string
    banner_title: string
}

interface IMerchantDashboardRes {
    totalSub: number
    totalIn: number
    amountSub: number
}
