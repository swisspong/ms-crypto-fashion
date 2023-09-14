export interface UpdateChargeMerchant {
    end_date: string
    amount: number
    mcht_id: string
}

export interface PaidOrderingEvent {
    chkt_id: string
    payment_method:string
    user_id:string
    amount_: number;
    token: string;
    orderIds: string[]
}

