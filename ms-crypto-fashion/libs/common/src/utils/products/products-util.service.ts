import { MerchantStatus } from "@app/common/enums"
import { IProduct } from "@app/common/interfaces/order-event.interface"


export class ProductsUtilService {
    constructor() { }
    isValid(product: IProduct) {
        if (
            product.available === true &&
            product.merchant.status === MerchantStatus.OPENED &&
            (
                product.groups.length > 0 && product.variants.length > 0
                    ? product.groups.every(group => group.options.length > 0) &&
                    product.variants.length > 0 &&
                    product.variants.every(variant =>
                        variant.variant_selecteds.length === product.groups.length &&
                        variant.variant_selecteds.some(vrnts =>
                            product.groups.some(group =>
                                group.vgrp_id === vrnts.vgrp_id &&
                                group.options.some(option => option.optn_id === vrnts.optn_id)
                            )
                        )
                    )
                    : product.groups.length === 0 && product.variants.length === 0 ? true : false
            )
        ) {
            return true
        }
        return false
    }
    isEqual(currProduct: IProduct, prevProduct: IProduct) {
        if (
            currProduct.available === prevProduct.available &&
            currProduct.merchant.status === prevProduct.merchant.status &&
            currProduct.groups.length === prevProduct.groups.length &&
            currProduct.variants.length === prevProduct.variants.length &&
            (
                currProduct.groups.length > 0
                    ? currProduct.groups.every(currGroup =>
                        prevProduct.groups.some(prevGroup =>
                            prevGroup.vgrp_id === currGroup.vgrp_id &&
                            prevGroup.name === currGroup.name &&
                            prevGroup.options.length === currGroup.options.length &&
                            currGroup.options.every(currOptoin =>
                                prevGroup.options.some(prevOption =>
                                    prevOption.optn_id === currOptoin.optn_id &&
                                    prevOption.name === currOptoin.name
                                )
                            )
                        )
                    ) &&
                    currProduct.variants.every(currVrnt =>
                        prevProduct.variants.some(prevVrnt =>
                            prevVrnt.vrnt_id === currVrnt.vrnt_id &&
                            prevVrnt.price === currVrnt.price &&
                            currVrnt.variant_selecteds.length === prevVrnt.variant_selecteds.length &&
                            currVrnt.variant_selecteds.every(currVrnts =>
                                prevVrnt.variant_selecteds.some(prevVrnts =>
                                    prevVrnts.optn_id === currVrnts.optn_id &&
                                    prevVrnts.vgrp_id === currVrnts.vgrp_id
                                )
                            )
                        )
                    )
                    : currProduct.price === prevProduct.price
            )
        ) {
            return true
        }
        return false
    }
    isIncludeVariant(product: IProduct, vrntId: string) {
        return product.variants.some(vrnt => vrnt.vrnt_id === vrntId)
    }
}