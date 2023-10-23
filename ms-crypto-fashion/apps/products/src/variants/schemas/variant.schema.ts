export class VariantSelected {
    optn_id: string;
    vgrp_id: string;
}




export class Variant {
    vrnt_id: string;
    variant_selecteds: VariantSelected[]
    price: number
    stock: number;
    image_url?: string
}