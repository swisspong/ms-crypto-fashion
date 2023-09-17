import { PaymentMethodFormat } from "../enums"
import { IOrderItemsEvent } from "./order-event.interface"

export interface UpdateChargeMerchant {
    end_date: string
    amount: number
    mcht_id: string
}

export interface PaidOrderingEvent {
    chkt_id: string
    payment_method: string
    user_id: string
    amount_: number;
    token: string;
    orders: IOrderItemsEvent[]
}


export interface IRefundEvent {
    orderId: string;
    chrgId: string;
    mchtId?: string;
    userId?: string;
    amount?: number;
    method: PaymentMethodFormat

}