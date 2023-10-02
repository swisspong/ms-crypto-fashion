import React from "react";

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

import useCartItemHook from "./use-cart-item-hook";
import { Checkbox } from "@/components/ui/checkbox";
import VaraintPopover from "../variant-popover";
import IconButton from "@/components/icon-button";

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
