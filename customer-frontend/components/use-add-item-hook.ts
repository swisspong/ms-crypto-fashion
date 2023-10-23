import { useAddToCart } from '@/src/hooks/cart/mutations';
import { useAddToWishlist } from '@/src/hooks/wishlist/mutations';
import React, { ChangeEvent, useEffect, useState } from 'react'
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

const formatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
});
const useAddItemHookNew = (data: IProductRow | undefined) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [selecteds, setSelecteds] = useState<
        { vgrpId: string; optnId: string }[]
    >([]);
    const addItemMutate = useAddToCart();
    const [activeVgrpId, setActiveVgrpId] = useState<string | undefined>()
    const selectValueChangeHandler = (value: string, group: IGroup) => {
        setSelecteds((prev) => {
            let variants: IVariant[] | undefined = undefined

            variants = data?.variants.filter(vrnt => vrnt.variant_selecteds.some(vrnts => vrnts.optn_id === value))

            const filteredSelectedsError = selecteds.filter(select => select.optnId !== '' && select.vgrpId !== group.vgrp_id && value !== '' && !variants?.some(vrnt => vrnt.variant_selecteds.some(vrnts => vrnts.optn_id === select.optnId)))
            console.log("filteredSelectedsError =>", filteredSelectedsError)
            const result = prev.map(groupState => {
                if (filteredSelectedsError.some(error => error.vgrpId === groupState.vgrpId)) {
                    return { ...groupState, optnId: '' }
                } else if (groupState.vgrpId === group.vgrp_id) {
                    return { ...groupState, optnId: value };
                }
                return groupState
            })
            return result;
        })
    }

    const disabledOption = (option: IOption, vgrpId: string) => {
        const optionNotInVariant = !data?.variants.some(vrnt => vrnt.variant_selecteds.some(vrnts => vrnts.optn_id === option.optn_id))
        if (optionNotInVariant) return true
        if (activeVgrpId === vgrpId && selecteds.some(select => select.vgrpId === vgrpId && select.optnId !== "")) {
            return false
        }
        const availableVaraints = data?.variants.filter(vrnt => selecteds.every(select => {
            if (select.optnId === '') {
                return true
            }
            return vrnt.variant_selecteds.some(vrnts => vrnts.vgrp_id === select.vgrpId && vrnts.optn_id === select.optnId)
        }))

        return !availableVaraints?.some(vrnt => vrnt.variant_selecteds.some(vrnts => vrnts.optn_id === option.optn_id))
    }
    const disableButton = (vrntId: string | undefined) => {
        const maxQty = maxQuantity(vrntId)
        if (data) {
            if (data.groups.length > 0 && data.variants.length > 0) {
                if (vrntId) {
                    const variant = data.variants.find(vrnt => vrnt.vrnt_id === vrntId)
                    if (variant) {
                        return quantity <= 0 || quantity > maxQty
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            }
            return quantity <= 0 || quantity > maxQty

        } else {
            return true
        }
    }
    const onOpenChange = (open: boolean, vgrpId: string) => {
        if (open) {
            setActiveVgrpId(vgrpId)
        } else {
            setActiveVgrpId(undefined)
        }
    }
    const whenSelectsChange = (vrntIdHandler: (vrntId: string | undefined) => void) => {
        useEffect(() => {
            console.log("selecteds => ", selecteds)
            if (selecteds.length > 0) {
                const selectedOptions = selecteds.filter(select => select.optnId !== '')
                console.log("test init selectedOptions =>", selectedOptions)
                if (selectedOptions.length > 0) {

                    const varinat = data?.variants.find(vrnt => vrnt.variant_selecteds.length === selectedOptions.length && selectedOptions.every(sl => vrnt.variant_selecteds.some(vrnts => vrnts.vgrp_id === sl.vgrpId && vrnts.optn_id === sl.optnId)))
                    if (varinat) {
                        console.log("test init", varinat.vrnt_id)
                        vrntIdHandler(varinat.vrnt_id)
                    } else {
                        vrntIdHandler(undefined)

                    }
                } else {
                    vrntIdHandler(undefined)
                }
            }
        }, [selecteds])
    }

    const whenVrntIdSelectedChange = (vrntId: string | undefined) => {
        useEffect(() => {
            if (data) {
                if (data.variants.length > 0) {
                    if (vrntId) {
                        setQuantity(data.variants.some((vrnts) => vrntId === vrnts.vrnt_id) ? 1 : 0)
                    } else {
                        setQuantity(0)
                    }
                } else {
                    setQuantity(data.stock > 0 ? 1 : 0)
                }
            } else {
                console.log("test else")
                setQuantity(0)
            }
            console.log("vrntId => ", vrntId)
        }, [vrntId]);
    }
    const whenDataChange = () => {

        useEffect(() => {
            if (data && data.groups.length > 0) {
                setSelecteds(data.groups.map(group => ({ vgrpId: group.vgrp_id, optnId: '' })))
            }
            if (data) {
                if (data.variants.length <= 0) {
                    setQuantity(data.stock > 0 ? 1 : 0)
                }
            }
        }, [data])
    }
    const disabledQtyInput = (vrntId: string | undefined) => {
        if (data) {
            if (data.groups.length > 0 && data.variants.length > 0) {
                if (vrntId) {
                    const variant = data.variants.find(vrnt => vrnt.vrnt_id === vrntId)
                    if (variant) {
                        console.log(variant)
                        return variant.stock <= 0
                    } else {
                        console.log("fdsfsfds")
                        return true
                    }
                } else {
                    console.log("fdsfsfds")
                    return true
                }
            }
            return data.stock <= 0
        }
        console.log("fdsfsfds")
        return true
    }
    const maxQuantity = (vrntId: string | undefined) => {
        if (data) {
            if (data.groups.length > 0 && data.variants.length > 0) {
                if (vrntId) {
                    const variant = data.variants.find(vrnt => vrnt.vrnt_id === vrntId)
                    if (variant) {
                        return variant.stock
                    } else {
                        return 0
                    }
                } else {
                    return 0
                }
            }
            return data.stock
        } else {
            return 0
        }
    }
    const showQuantity = (vrntId: string | undefined) => {
        const maxQty = maxQuantity(vrntId)
        if (quantity > maxQty) {
            return maxQty
        } else {
            return quantity
        }
    }
    const qtyChangeHandler = (event: ChangeEvent<HTMLInputElement>, vrntId: string | undefined) => {
        const qty = Number(event.target.value)
        const maxQty = maxQuantity(vrntId)

        if (qty > maxQty) {
            setQuantity(maxQty)
        } else if (qty <= 0) {
            setQuantity(1)
        } else {

            setQuantity(qty)
        }
    }

    const onSubmit = (canAddToCart: boolean) => {
        if (data && data.variants.length <= 0 && canAddToCart) {
            console.log(quantity);
            addItemMutate.mutate({ prodId: data.prod_id!, body: { quantity } });

        } else if (data) {
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
                addItemMutate.mutate({ prodId: data.prod_id!, body: { quantity, vrnt_id: vrnt } });
                console.log(quantity, vrnt);
            }
        }
    };
    const showCurrentPrice = (vrntId: string | undefined) => {
        if (vrntId) {
            const variant = data?.variants.find(vrnt => vrnt.vrnt_id === vrntId)
            if (variant) return formatter.format(Number(variant.price))
        }
        return undefined
    }
    const hasVariant = () => {
        if (data) {
            return data.groups.length > 0 && data.variants.length > 0
        }
        return false

    }
    const showCurrentVariantStock = (vrntId: string | undefined) => {
        if (vrntId) {
            const variant = data?.variants.find(vrnt => vrnt.vrnt_id === vrntId)
            if (variant) return variant.stock
        } else {
            return undefined
        }
    }
   
    useEffect(() => {
        if (addItemMutate.isSuccess) {
            toast.success("เพิ่มลงตะกร้าสำเร็จ");
        }
    }, [addItemMutate.isSuccess]);
    return {
        disabledOption,
        selectValueChangeHandler,
        quantity,
        whenSelectsChange,
        whenVrntIdSelectedChange,
        showSelectValue,
        selecteds,
        onOpenChange,
        activeVgrpId,
        disabledQtyInput,
        maxQuantity,
        showQuantity,
        qtyChangeHandler,
        disableButton,
        onSubmit,
        setSelecteds,
        setQuantity,
        whenDataChange,
        showCurrentPrice,
        hasVariant: hasVariant(),
        showCurrentVariantStock
    }

}
export {
    useAddItemHookNew
}
export default useAddItemHook