import { useAddToCart } from '@/src/hooks/cart/mutations';
import { useAddToWishlist } from '@/src/hooks/wishlist/mutations';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { disableSelect, showSelectValue } from './add-item-helper';

const useAddItemHook = (data: IProductRow | undefined, vrntSelectedHandler: (selecteds: {
    vgrpId: string;
    optnId: string;
}[]) => void, vrntSelected: string | undefined, canAddToCart?: boolean) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [selecteds, setSelecteds] = useState<
        { vgrpId: string; optnId: string }[]
    >([]);
    const { mutate, isSuccess } = useAddToCart();

    // *Wishlist
    const { mutate: handleWishlist } = useAddToWishlist()

    useEffect(() => {
        if (data) {
            setSelecteds(
                data.groups.map((group) => ({ vgrpId: group.vgrp_id, optnId: "" }))
            );
        }
        setQuantity(data?.stock && data.stock > 0 ? 1 : 0);
    }, [data]);

    useEffect(() => {
        vrntSelectedHandler(selecteds)
    }, [selecteds]);

    useEffect(() => {
        if (vrntSelected) {
            setQuantity(
                data?.variants && data?.variants.length > 0
                    ? data.variants.some((vrnts) => vrntSelected === vrnts.vrnt_id)
                        ? 1
                        : 0
                    : data?.stock && data.stock > 0
                        ? 1
                        : 0
            );
        }
    }, [vrntSelected]);

    const onSubmit = () => {
        if (data?.variants && data.variants.length <= 0 && canAddToCart) {
            console.log(quantity);
            mutate({ prodId: data.prod_id!, body: { quantity } });

        } else if (data?.variants) {
            const vrnt =
                data.variants.find((variant) =>
                    variant.variant_selecteds.every((vrnts) =>
                        selecteds.some(
                            (slct) =>
                                slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
                        )
                    )
                )?.vrnt_id ?? undefined;
            if (vrnt && canAddToCart) {
                mutate({ prodId: data.prod_id!, body: { quantity, vrnt_id: vrnt } });
                console.log(quantity, vrnt);
            }
        }
    };

    const onClickToWishlist = () => {
        if (data) {
            handleWishlist({ prod_id: data.prod_id! })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("เพิ่มลงตะกร้าสำเร็จ");
        }
    }, [isSuccess]);

    const disableButtonHandler = (): boolean => {
        if (data?.variants && data.variants.length > 0) {
            return data.variants.find((variant) =>
                variant.variant_selecteds.every((vrnts) =>
                    selecteds.some(
                        (slct) =>
                            slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
                    )
                )
            )?.vrnt_id
                ? false
                : true;
        } else {
            return false;
        }
    };
    const quantityHandler = (qty: number) => {
        setQuantity(qty)
    }
    const selectValueChangeHandler = (value: string, group: IGroup) => {
        setSelecteds((prev) => {
            const result = prev.map((groupState) => {
                if (groupState.vgrpId === group.vgrp_id) {
                    return { ...groupState, optnId: value };
                }
                return groupState;
            });
            const isSelectedCompolete = result.every(
                (selected) => selected.optnId.trim().length > 0
            );
            console.log(isSelectedCompolete);
            if (isSelectedCompolete) {
                const isValid = data?.variants.some((variant) =>
                    variant.variant_selecteds.every((vrnts) =>
                        result.some(
                            (selected) =>
                                selected.optnId === vrnts.optn_id &&
                                selected.vgrpId === vrnts.vgrp_id
                        )
                    )
                );

                if (!isValid) {
                    return result.map((groupState) => {
                        if (groupState.vgrpId === group.vgrp_id) {
                            return { ...groupState, optnId: value };
                        }
                        return { ...groupState, optnId: "" };
                    });
                }
            }
            return result;
        })
    }
    return {
        disableButtonHandler,
        onClickToWishlist,
        onSubmit,
        quantityHandler,
        quantity,
        selectValueChangeHandler,
        disableSelect,
        showSelectValue,
        selecteds
    }
}

export default useAddItemHook