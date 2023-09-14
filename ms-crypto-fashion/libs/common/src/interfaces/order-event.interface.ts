export interface UpdateStatusOrder {
    order_id: string,
    review: string
}

export interface FindOrderById {
    order_id: string
}




export enum PaymentMethodFormat {
    CREDIT = "credit",
    WALLET = "wallet",
}
interface Merchant {
    mcht_id: string;
    user_id: string;
    name: string;
    status?: string

}
interface Option {
    optn_id: string
    name: string
}

interface VariantGroup {
    vgrp_id: string;
    name: string
    options: Option[]
}
interface VariantSelected {
    optn_id: string;
    vgrp_id: string;
}


interface Variant {
    vrnt_id: string;
    variant_selecteds: VariantSelected[]
    price: number
    stock: number;
    image_url?: string
}
export interface IProduct {
    prod_id: string;
    name: string;
    available?: boolean
    stock: number;
    price: number;
    image_urls: string[]
    merchant: Merchant
    groups: VariantGroup[]
    variants: Variant[]
    payment_methods: string[]
}


export interface CheckoutItem {
    item_id: string;
    quantity: number
    price: number;
    total: number;
    variant: {
        optn_id: string
        vgrp_id: string;
        option_name: string
        group_name: string
    }[]
    image: string
    vrnt_id?: string
    prod_id: string
    product: IProduct
}


export interface OrderingEventPayload {
    chkt_id: string
    user_id: string
    items: CheckoutItem[]
    address: string
    recipient: string
    post_code: string
    tel_number: string
    token?: string
    payment_method: PaymentMethodFormat
}

export interface IUpdateOrderStatusEventPayload {
    chkt_id: string
    user_id:string
    orderIds: string[]
    sucess: boolean
    chargeId: string
}