import { useAddItemHookNew } from '@/components/use-add-item-hook';
import { useEditItemCart } from '@/src/hooks/cart/mutations';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const useVariantPopoverHook = (data: ICartItem) => {
    const [vrntId, setVrntId] = useState<string | undefined>()
    const [openPopover, setOpenPopover] = useState(false);
    const editMutate = useEditItemCart();
    const { selecteds, setSelecteds, setQuantity, showSelectValue: showSelectValueParent, onOpenChange, selectValueChangeHandler, disabledOption, whenSelectsChange, whenVrntIdSelectedChange, maxQuantity } = useAddItemHookNew(data.product)
    const vrntIdHandler = (vrntId: string | undefined) => {
        setVrntId(vrntId)
    }
    const initVariant = () => {
        const variant = data.product.variants.find((vrnts) => vrnts.vrnt_id === data.vrnt_id)
        if (variant) {
            setSelecteds(
                data.product.groups.map(group => {
                    const found = variant.variant_selecteds.find(vrnts => vrnts.vgrp_id === group.vgrp_id)
                    return {
                        optnId: found ? found.optn_id : "",
                        vgrpId: group.vgrp_id
                    }
                })
            );
            setQuantity(data.quantity > variant.stock ? variant.stock : data.quantity);
        }
    }
    const popoverOpenChangeHandler = (open: boolean) => {
        if (!editMutate.isLoading) {
            if (open) {
                initVariant()
            }
            setOpenPopover(open);
        }
    }
    const showSelectValue = (group: IGroup) => {
        return showSelectValueParent(selecteds, group)
    }
    const openPopoverHandler = (open: boolean) => {
        setOpenPopover(open)
    }

    const disabledButton = () => {
        if (vrntId) {
            const maxQty = maxQuantity(vrntId)
            if (maxQty <= 0) {
                return true
            }
            return false
        } else {
            return true
        }
    }
    const onSubmit = () => {
        if (vrntId) {
            const maxQty = maxQuantity(vrntId)
            if (maxQty > 0) {
                const quantity = data.quantity > maxQty ? maxQty : data.quantity
                editMutate.mutate({
                    itemId: data.item_id,
                    body: { quantity, vrnt_id: vrntId },
                })
            }
        }
    }

    useEffect(() => {
        initVariant()
    }, [data]);
    whenSelectsChange(vrntIdHandler);
    whenVrntIdSelectedChange(vrntId);
    useEffect(() => {
        if (editMutate.isSuccess) {
            toast.success("แก้ไขสำเร็จ!");
            setOpenPopover(false);
        }
    }, [editMutate.isSuccess]);
    return {
        openPopover,
        popoverOpenChangeHandler,
        showSelectValue,
        onOpenChange,
        selectValueChangeHandler,
        disabledOption,
        openPopoverHandler,
        disabledButton,
        onSubmit

    }
}

export default useVariantPopoverHook