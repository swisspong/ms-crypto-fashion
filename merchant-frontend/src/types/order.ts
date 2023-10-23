// interface IOrderRow {
//     id: string;
//     email: string;
//     image: string;
//     amount: number;
//     created_at: string;
//     status: "NOT PAID" | "PAID" | "REFUND"
// }
interface IFullfillmentPayload {
    shipping_carier: string
    tracking: string
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
    status: string;
    payment_status: string
    total: number
    items: Item[]
    address: string
    recipient: string
    post_code: string
    tel_number: string
    createdAt: string
    updatedAt: string
    shipping_carier?: string
    tracking?: string
    wei:number
    shipped_at?: string;
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