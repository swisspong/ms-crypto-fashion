interface ICheckoutPayload {
    payment_method: "credit" | "wallet"
    items: string[]
}

interface ICheckoutResponse {
    chkt_id: string
    user_id: string
    payment_method: "credit" | "wallet"
    total_quantity: number
    total: number
    items: Item[]
    errorItems: Item[]
}
interface ICheckoutOrdering {
    chkt?: string
}


interface ICheckout {
    chkt_id: string
    user_id: string
    payment_method: "credit" | "wallet"
    total_quantity: number
    total: number
    items: Item[]
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface Item {
    item_id: string
    quantity: number
    name: string
    price: number
    total: number
    product: IProductRow
    variant: Variant[]
    vrnt_id: string
    message?: string
    image: string
}

interface Variant {
    optn_id: string
    vgrp_id: string
    option_name: string
    group_name: string
}
