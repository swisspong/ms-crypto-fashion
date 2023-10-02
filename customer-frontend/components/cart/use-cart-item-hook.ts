import {
  useEditItemCart,
  useRemoveItemInCart,
} from "@/src/hooks/cart/mutations";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { showImage, showPrice, showRemainingStock, showTotalPrice } from "./cart-item-helper";

const useCartItemHook = () => {
  const removeMutate = useRemoveItemInCart();
  const editMutate = useEditItemCart();
  const removeItem = (id: string) => removeMutate.mutate(id);
  const increaseQty = (data: ICartItem) => {
    if (data.vrnt_id) {
      editMutate.mutate({
        itemId: data.item_id,
        body: {
          quantity: data.quantity + 1,
          vrnt_id: data.vrnt_id,
        },
      });
    } else {
      editMutate.mutate({
        itemId: data.item_id,
        body: { quantity: data.quantity + 1 },
      });
    }
  }
  const decreaseQty = (data: ICartItem) => {
    if (data.quantity - 1 <= 0) return;
    if (data.vrnt_id) {
      editMutate.mutate({
        itemId: data.item_id,
        body: {
          quantity: data.quantity - 1,
          vrnt_id: data.vrnt_id,
        },
      });
    } else {
      editMutate.mutate({
        itemId: data.item_id,
        body: { quantity: data.quantity - 1 },
      });
    }
  }
  useEffect(() => {
    if (removeMutate.isSuccess) {
      toast.success("ลบรายการสำเร็จ!");
    }
  }, [removeMutate.isSuccess]);

  return {
    removeLoading: removeMutate.isLoading,
    editLoading: editMutate.isLoading,
    removeItem,
    increaseQty,
    decreaseQty,
    image: showImage,
    price: showPrice,
    remainingStock: showRemainingStock,
    totalPrice: showTotalPrice
  };
};

export default useCartItemHook;
