import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Bitcoin,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Minus,
  Store,
  X,
} from "lucide-react";
import { Plus } from "lucide-react";
import { PaymentMethodFormat } from "@/src/types/enums/product";
import IconButton from "../icon-button";
import {
  useEditItemCart,
  useRemoveItemInCart,
} from "@/src/hooks/cart/mutations";
import { toast } from "react-toastify";
import VaraintPopover from "./variant-popover";

interface CartItemProps {
  data: ICartItem;
  setSelecteds: Dispatch<SetStateAction<string[]>>;
  selecteds: string[];
  isNormalPay?: boolean | undefined;
}
const CartItemNew: React.FC<CartItemProps> = ({
  data,
  isNormalPay,
  selecteds,
  setSelecteds,
}) => {
  const removeMutate = useRemoveItemInCart();
  const editMutate = useEditItemCart();
  useEffect(() => {
    if (removeMutate.isSuccess) {
      toast.success("ลบรายการสำเร็จ!");
    }
  }, [removeMutate.isSuccess]);
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
          <div className="absolute z-10 right-0 top-0">
            <IconButton
              icon={<X size={15} />}
              onClick={() => removeMutate.mutate(data.item_id)}
            />
          </div>
          <div className="flex items-center self-start space-x-2">
            <div className="">
              <Checkbox
                disabled={isNormalPay === undefined}
                id={data.item_id}
                checked={selecteds.includes(data.item_id)}
                onCheckedChange={(checked) => {
                  setSelecteds((prev) => {
                    return selecteds.includes(data.item_id)
                      ? prev.filter((item) => item !== data.item_id)
                      : [...prev, data.item_id];
                  });
                }}
              />
              <label
                htmlFor={data.item_id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex space-x-2 items-center"
              ></label>
            </div>
            <div className="relative h-20 w-20 rounded-md overflow-hidden border sm:h-32 sm:w-32">
              <img
                src={
                  (data.vrnt_id
                    ? data.product.variants.find(
                        (vrnt) => vrnt.vrnt_id === data.vrnt_id
                      )?.image_url
                      ? data.product.variants.find(
                          (vrnt) => vrnt.vrnt_id === data.vrnt_id
                        )?.image_url
                      : data.product.image_urls[0]
                    : data.product.image_urls[0]) as string
                }
                alt=""
                className="object-cover object-center"
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
              {data.product.payment_methods.map((payment) =>
                payment === PaymentMethodFormat.CREDIT ? (
                  <CreditCard className="w-4" />
                ) : (
                  <Bitcoin className="w-4" />
                )
              )}
            </div>
            <div className="col-span-2 flex space-x-1 items-center text-sm sm:text-base font-medium">
              <span>
                ฿
                {data.vrnt_id
                  ? data.product.variants.find(
                      (vrnts) => vrnts.vrnt_id === data.vrnt_id
                    )?.price
                  : data.product?.price}
              </span>
              <span>x</span>
              <span>{data.quantity}</span>
              <span>=</span>
              <span>
                ฿
                {(data.vrnt_id
                  ? data.product.variants.find(
                      (vrnts) => vrnts.vrnt_id === data.vrnt_id
                    )?.price ?? 0
                  : data.product?.price) * data.quantity}
              </span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <p
                className=" border rounded-md p-1 cursor-pointer"
                onClick={() => {
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
                }}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </p>
              <span className="text-sm">{data.quantity}</span>
              <p className=" border rounded-md p-1 cursor-pointer">
                <Minus
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  onClick={() => {
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
                  }}
                />
              </p>
              <span className="text-xs">
                คงเเหลือ{" "}
                {data.vrnt_id
                  ? data.product.variants.find(
                      (vrnt) => vrnt.vrnt_id === data.vrnt_id
                    )?.stock
                  : data.product.stock}
              </span>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default CartItemNew;
