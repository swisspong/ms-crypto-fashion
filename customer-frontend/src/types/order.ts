// interface IOrderRow {
//     id: string;
//     email: string;
//     image: string;
//     amount: number;
//     created_at: string;
//     status: "NOT PAID" | "PAID" | "REFUND"
// }


interface IOrderPayload {
    chkt_id: string
    address: string
    recipient: string
    post_code: string
    tel_number: string
    token?: string
    payment_method: "credit" | "wallet"
}

interface ICreateOrderWallet {
    data: {
        orderId: string,
        total: number,
        wei: {
            wei: number,
            bath: number
        }
    }[]
}
interface IOrderWalletResponse {
    data: {
        userId:string,
        items:{id:string,wei:number,mchtId:string}[],
        totalWei: number
    }
}
interface IOrders {
    data: IOrderRow[]
    page: number
    per_page: number
    total: number
    total_page: number
}

interface IOrderRow {
    _id: string
    order_id: string
    user_id: string
    total_quantity: number
    mcht_id: string;
    mcht_name: string
    total: number
    status: string;
    payment_status: string
    items: Item[]
    prod_id: string
    address: string
    recipient: string
    post_code: string
    tel_number: string
    reviewStatus: string
    createdAt: string
    updatedAt: string
    shipping_carier?: string;
    tracking?: string;
    shipped_at?: string
    __v: number
}

interface Item {
    item_id: string
    name: string
    price: number
    quantity: number
    total: number
    prod_id: string
    variant: Variant[]
    vrnt_id: string
    image: string
}

interface Variant {
    optn_id: string
    vgrp_id: string
    option_name: string
    group_name: string
}

interface IOrderWalletError{
    orderIds: string[]
}
interface IOrderSetTxHash{
    orderIds: string[]
    txHash:string
}