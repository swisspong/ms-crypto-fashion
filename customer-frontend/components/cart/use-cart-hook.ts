import { useMyCart } from '@/src/hooks/cart/queries';
import { PaymentMethodFormat } from '@/src/types/enums/product';
import { data } from 'autoprefixer';
import React, { useEffect, useState } from 'react'

const useCartHook = () => {
    const [selecteds, setSelecteds] = useState<string[]>([]);
    const [isNormalPay, setIsNormalPay] = useState<boolean | undefined>();
    const paymentMethodHandler = (val: boolean | undefined) => {
        setSelecteds([]);
        setIsNormalPay(val);
    };
    const cartItemQuery = useMyCart();
    useEffect(() => {
        console.log(selecteds);
    }, [selecteds]);
    const onCheckedHandler = (itemId: string) => {
        // setSelecteds(data)
        setSelecteds((prev) => {
            return selecteds.includes(itemId)
                ? prev.filter((item) => item !== itemId)
                : [...prev, itemId];
        });
    }
    const filterItemByPayementMethod = () => {
        if (cartItemQuery.data?.items) {
            const filteredItems = cartItemQuery.data.items
                .filter(
                    (item) => {
                        if (isNormalPay === undefined) return true
                        if (isNormalPay === true &&
                            item.product.payment_methods.includes(
                                PaymentMethodFormat.CREDIT
                            )) return true
                        if (isNormalPay === false &&
                            item.product.payment_methods.includes(
                                PaymentMethodFormat.WALLET
                            )) return true
                        return false
                    }
                )
            return filteredItems
        }
        return []
    }

    return {
        cartItems: cartItemQuery.data,
        cartItemsLoading: cartItemQuery.isLoading,
        selecteds,
        isNormalPay,
        paymentMethodHandler,
        filterItemByPayementMethod: filterItemByPayementMethod(),
        onCheckedHandler
    }
}

export default useCartHook