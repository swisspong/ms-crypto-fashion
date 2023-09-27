import { Injectable } from "@nestjs/common";
import { Product } from "apps/products/src/schemas/product.schema";
import { VariantGroup } from "apps/products/src/variant_groups/schemas/variant-group.schema";
import { Variant } from "apps/products/src/variants/schemas/variant.schema";

@Injectable()
export class ProductValidator {
    // validate(product: Product): void {
    //     // Your validation logic for the entire product
    //     // For simplicity, let's assume basic validation here

    //     if (!product.name || product.price === undefined || product.stock === undefined) {
    //         throw new Error('Incomplete product information');
    //     }

    //     if (product.stock < 0) {
    //         throw new Error('Invalid stock value');
    //     }
    //     if (
    //         product.variants.length <= 0 && product.groups.length > 0 &&
    //         product.variants.length > 0 && product.groups.length <= 0
    //     ) {
    //         throw new Error("Invalid option")
    //     }

    //     if (
    //         product.variants.length > 0 &&
    //         product.groups.length > 0
    //     ) {
    //         this.validateGroups(product.groups)
    //         this.validateOptions(product.variants)
    //         this.validateVariantSelected(product.variants, product.groups)
    //     }
    // }
    // validateGroups(variantGroups: VariantGroup[]): void {
    //     variantGroups.map(vgrp => {
    //         if (vgrp.options.length <= 0) {
    //             throw new Error("Invalid option")
    //         }
    //     })
    // }

    // validateOptions(options: Variant[]): void {
    //     // Your validation logic for options, e.g., checking if they are valid, etc.
    //     for (const option of options) {
    //         if (option.variant_selecteds.length <= 0) {
    //             throw new Error("Invalid option")
    //         }

    //     }
    // }
    // validateVariantSelected(options: Variant[], variantGroups: VariantGroup[]): void {
    //     const isValid = options.every(option => option.variant_selecteds.every(variantSelected =>
    //         variantGroups.some(vgrp =>
    //             vgrp.vgrp_id === variantSelected.vgrp_id && vgrp.options.some(optn => optn.optn_id === variantSelected.optn_id
    //             )
    //         )
    //     ))
    //     if (!isValid) throw new Error("Invalid option")
    // }

    // validateEquality(product1: Product, product2: Product): void {
    //     if (
    //         product1.name !== product2.name ||
    //         product1.price !== product2.price 
    //     ) {
    //         throw new Error('Products are not equal');
    //     }

    //     // Validate equality for options if needed
    //     if (product1.options.length !== product2.options.length) {
    //         throw new Error('Products have different option counts');
    //     }

    //     for (let i = 0; i < product1.options.length; i++) {
    //         const option1 = product1.options[i];
    //         const option2 = product2.options[i];

    //         if (option1.name !== option2.name || option1.value !== option2.value || option1.variantGroup !== option2.variantGroup) {
    //             throw new Error('Options are not equal');
    //         }
    //     }
    // }
}