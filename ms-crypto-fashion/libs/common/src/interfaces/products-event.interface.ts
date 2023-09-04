
interface IMerchant {
    _id: string
    mcht_id: string
    name: string
    status: string
    banner_title: string
    banner_url: string
    createdAt: string
    updatedAt: string
    __v: number
}
interface ICategoryWebRow {
    _id: string
    catweb_id: string;
    name: string;
    image?: string;
}
interface ICategoryRow {
    cat_id: string;
    name: string;
    image?: string;
}
export interface ProductPayloadDataEvent {
    prod_id: string
    name: string
    available: boolean
    sku: string
    stock: number
    description: string;
    price: number
    image_urls: string[]
    categories: ICategoryRow[]
    categories_web: ICategoryWebRow[]
    merchant: IMerchant
    groups: IGroup[]
    variants: IVariant[]
    payment_methods: string[]
    createdAt: string
    updatedAt: string
}
interface IOption {
    optn_id: string;
    name: string;
}
interface IGroup {
    vgrp_id: string;
    name: string;
    options: IOption[]
}
interface IVariantSelected {
    vgrp_id: string;
    optn_id: string;
}
interface IVariant {
    vrnt_id: string
    variant_selecteds: IVariantSelected[]
    price: number
    stock: number
    image_url?: string
}
