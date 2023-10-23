import { INVALID_OPTIONS, INVALID_PAYMENT, OUT_OF_STOCK, PRODUCT_INFORMATION_HAS_CHANGED, PRODUCT_NOT_AVAILABLE, STORE_NOT_AVAILABLE } from "@app/common/constants/error.constant";
import { MerchantStatus, PaymentMethodFormat } from "@app/common/enums";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Merchant } from "apps/products/src/merchants/schemas/merchant.schema";
import { Product } from "apps/products/src/schemas/product.schema";
import { VariantGroup } from "apps/products/src/variant_groups/schemas/variant-group.schema";
import { Variant, VariantSelected } from "apps/products/src/variants/schemas/variant.schema";

@Injectable()
export class ProductsValidator {
    validate(product: Product): void {
        // Your validation logic for the entire product
        // For simplicity, let's assume basic validation here

        if (
            !product.name ||
            product.price === undefined ||
            product.stock === undefined ||
            !product.merchant ||
            (product.merchant as Merchant).status !== MerchantStatus.OPENED ||
            !product.available
        ) {
            throw new Error(PRODUCT_NOT_AVAILABLE);
        }

        if (product.stock < 0) {
            throw new Error(OUT_OF_STOCK);
        }
        if (
            product.variants.length <= 0 && product.groups.length > 0 ||
            product.variants.length > 0 && product.groups.length <= 0
        ) {
            throw new Error(INVALID_OPTIONS)
        }

        if (
            product.variants.length > 0 &&
            product.groups.length > 0
        ) {
            this.validateGroups(product.groups)
            this.validateOptions(product.variants)
            this.validateVariantSelecteds(product.variants, product.groups)
        }
    }
    validateIncludeOptions(options: Variant[], vrntId: string): void {
        const isValid = options.some(optn => optn.vrnt_id === vrntId)
        if (!isValid) throw new Error(INVALID_OPTIONS)
    }
    validateMerchant(product: Product): void {
        if (!product.merchant || (product.merchant as Merchant).status !== MerchantStatus.OPENED) {
            throw new Error(STORE_NOT_AVAILABLE)
        }
    }
    validateAvailable(product: Product): void {
        if (!product.available) {
            throw new Error(PRODUCT_NOT_AVAILABLE)
        }
    }
    validateGroups(variantGroups: VariantGroup[]): void {
        variantGroups.map(vgrp => {
            if (vgrp.options.length <= 0) {
                throw new Error(INVALID_OPTIONS)
            }
        })
    }

    validateOptions(options: Variant[]): void {
        // Your validation logic for options, e.g., checking if they are valid, etc.
        for (const option of options) {
            if (option.variant_selecteds.length <= 0) {
                throw new Error(INVALID_OPTIONS)
            }

        }
    }
    validateVariantSelecteds(options: Variant[], variantGroups: VariantGroup[]): void {
        const isValid = options.every(option => option.variant_selecteds.every(variantSelected =>
            variantGroups.some(vgrp =>
                vgrp.vgrp_id === variantSelected.vgrp_id && vgrp.options.some(optn => optn.optn_id === variantSelected.optn_id
                )
            )
        ))
        if (!isValid) throw new Error(INVALID_OPTIONS)
    }

    validateEquality(product1: Product, product2: Product): void {
        if (
            product1.name !== product2.name ||
            product1.price !== product2.price ||
            product1.variants.length !== product2.variants.length ||
            product1.groups.length !== product2.groups.length
        ) {
            throw new Error(PRODUCT_INFORMATION_HAS_CHANGED);
        }

        this.validateEqualityOptions(product1.variants, product2.variants)
    }
    validateEqualityOptions(option1: Variant[], option2: Variant[]): void {
        if (
            option1.length !== option2.length
        ) throw new Error(INVALID_OPTIONS)
        if (option1.length > 0 && option2.length > 0) {
            const isValid = option1.every(optn1 =>
                option2.some(optn2 => {
                    if (

                        optn1.vrnt_id === optn2.vrnt_id &&
                        optn1.price === optn2.price
                    ) {
                        this.validateEqualityVariantSelecteds(optn1.variant_selecteds, optn2.variant_selecteds)
                        return true
                    }
                })
            )
            if (!isValid) throw new Error(INVALID_OPTIONS)
        }
    }
    validateEqualityVariantSelecteds(variantSelected1: VariantSelected[], variantSelected2: VariantSelected[]): void {
        if (
            variantSelected1.length <= 0 ||
            variantSelected2.length <= 0 ||
            variantSelected1.length !== variantSelected2.length
        ) throw new Error(INVALID_OPTIONS)

        const isValid = variantSelected1.every(vrnts1 =>
            variantSelected2.some(vrnts2 => vrnts1.optn_id === vrnts2.optn_id && vrnts1.vgrp_id === vrnts2.vgrp_id)
        )
        if (!isValid) throw new Error(INVALID_OPTIONS)
    }
    validateIsHasGroups(variantGroups: VariantGroup[]): boolean {
        if (variantGroups.length > 0) return true
        return false
    }
    validateIsHasOptions(options: Variant[]): boolean {
        if (options.length > 0) return true
        return false
    }
    validateIncludePayment(product: Product, method: string) {
        if (!product.payment_methods.includes(method)) {
            throw new Error(INVALID_PAYMENT)
        }

    }
}