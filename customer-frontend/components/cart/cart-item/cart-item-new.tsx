import React, { useEffect } from "react";

import {
  Bitcoin,
  ChevronRight,
  CreditCard,
  Minus,
  Store,
  X,
} from "lucide-react";
import { Plus } from "lucide-react";
import { PaymentMethodFormat } from "@/src/types/enums/product";

import { useAddToWishlist } from "@/src/hooks/wishlist/mutations";
import { useWishlistInfo } from "@/src/hooks/wishlist/queries";
import useCartItemHook from "./use-cart-item-hook";
import { useEditItemCart, useRemoveItemInCart } from "@/src/hooks/cart/mutations";
import { toast } from "react-toastify";
import IconButton from "@/components/icon-button";
import { Button } from "@/components/ui/button";
// import VaraintPopover from "../variant-popover";
import { Checkbox } from "@/components/ui/checkbox";
import VaraintPopover from "./variant/variant-popover";

interface CartItemProps {
  data: ICartItem;
  onCheckedHandler: (itemId: string) => void;
  selecteds: string[];
  isNormalPay?: boolean | undefined;
}
const CartItemNew: React.FC<CartItemProps> = ({
  data,
  isNormalPay,
  selecteds,
  onCheckedHandler,
}) => {
  const removeMutate = useRemoveItemInCart();
  const editMutate = useEditItemCart();
  useEffect(() => {
    if (removeMutate.isSuccess) {
      toast.success("ลบรายการสำเร็จ!");
    }
  }, [removeMutate.isSuccess]);

  // *Wishlist
  const { mutate: handleWishlist, isLoading: wishlistLoading, isSuccess: wishlistSuccess } = useAddToWishlist()
  const { data: wishlist, isLoading: checkWishlistLoading, isSuccess: checkWishlistSuccess } = useWishlistInfo(data.product.prod_id!)

  const onClickToWishlist = () => {
    if (data) {
      handleWishlist({ prod_id: data.product.prod_id! })
    }
  }

  useEffect(() => {
    if (wishlistSuccess) {
      if (!wishlist?.check_wishlist) {
        toast.success("เพิ่มลงสินค้าที่อยากได้สำเร็จ");
      } else if (wishlist?.check_wishlist) {
        toast.success("ยกเลิกสินค้าที่อยากได้สำเร็จ");
      }
    }
  }, [wishlistSuccess]);
  const {
    image,
    removeItem,
    increaseQty,
    decreaseQty,
    remainingStock,
    price,
    totalPrice,
  } = useCartItemHook();
  return (
    <>
      <li className="pb-6 border-y list-none flex flex-col space-y-1">
        <div className="flex items-center space-x-1 py-1 w-full border-b">
          <Store className="whitespace-nowrap w-6" />
          <span className="text-sm truncate">
            {data.product?.merchant.name}
          </span>
          <ChevronRight className="whitespace-nowrap w-6" />
        </div>
        <div className="flex space-x-2 md:space-x-5 relative">
          <div className="flex items-center self-start space-x-2">
            <div className="">
              <Checkbox
                disabled={isNormalPay === undefined}
                id={data.item_id}
                checked={selecteds.includes(data.item_id)}
                onCheckedChange={(checked) => onCheckedHandler(data.item_id)}
              />
              <label
                htmlFor={data.item_id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex space-x-2 items-center"
              ></label>
            </div>
            <div className="relative h-20 w-20 rounded-md overflow-hidden border sm:h-32 sm:w-32">
              <img
                src={image(data)}
                alt=""
               // className="object-cover object-center"
               className="object-contain object-center h-full w-full"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <p className="line-clamp-1 font-medium text-sm sm:text-base">
              {data.product?.name}
            </p>
            {data.vrnt_id ? <VaraintPopover data={data} /> : undefined}
            <div className="flex space-x-1 items-center">
              <span className="font-medium text-xs sm:text-sm">
                การชำระเงิน:
              </span>
              {data.product.payment_methods.map((payment,index) =>
                payment === PaymentMethodFormat.CREDIT ? (
                  <CreditCard key={index} className="w-4" />
                ) : (
                  <Bitcoin className="w-4" key={index} />
                )
              )}
            </div>
            <div className="col-span-2 flex space-x-1 items-center text-sm sm:text-base font-medium">
              <span>฿{price(data)}</span>
              <span>x</span>
              <span>{data.quantity}</span>
              <span>=</span>
              <span>฿{totalPrice(data)}</span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <p
                className=" border rounded-md p-1 cursor-pointer"
                onClick={() => {
                  increaseQty(data);
                }}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </p>
              <span className="text-sm">{data.quantity}</span>
              <p className=" border rounded-md p-1 cursor-pointer">
                <Minus
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  onClick={() => {
                    decreaseQty(data);
                  }}
                />
              </p>
              <span className="text-xs">คงเเหลือ {remainingStock(data)}</span>
              <Button
                onClick={onClickToWishlist}
                className="flex items-center gap-x-2"
                variant={"ghost"}
                disabled={wishlistLoading}
              >
                {
                  wishlist?.check_wishlist ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </>
                  )
                }
              </Button>
            </div>
          </div>
          <div className="absolute z-10 right-0 top-0">
            <IconButton
              icon={<X size={15} />}
              onClick={() => removeItem(data.item_id)}
            />
          </div>
        </div>
      </li>
    </>
  );
};

export default CartItemNew;
