import Image from "next/image";
import { Minus, Plus, Store, X } from "lucide-react";
import Currency from "./currency";
import IconButton from "./icon-button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useEditItemCart } from "@/src/hooks/cart/mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import EditItemDialog from "./edit-item-dialog";
import { toast } from "react-toastify";

interface CartItemProps {
  data: ICartItem;
}

const CartItemRemove: React.FC<CartItemProps> = ({ data }) => {
  // const { mutate, isSuccess } = useRemoveCategory();
  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("Remove item success!");
  //   }
  // }, [isSuccess]);
  return (
    <li className="py-6 border-b list-none">
      <div className="flex relative">
        <div className="relative h-24 w-24 rounded-md overflow-hidden">
          <Image
            fill
            src={data.product?.image_urls[0]}
            alt=""
            className="object-cover object-center"
          />
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="absolute z-10 right-0 top-0">
            <Badge variant={"destructive"}>{data.message}</Badge>
          </div>
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div className="flex items-center space-x-2 border p-1 rounded-md">
              <Store size={15} />
              <span className="text-sm">{data.product?.merchant.name}</span>
            </div>
            <div></div>
            <div className="flex justify-between">
              <p className=" text-lg font-semibold text-black">
                {data.product?.name}
              </p>
            </div>

            {data.vrnt_id ? (
              <div className="col-span-2 flex space-x-2">
                {data.product.variants
                  .find((vrnt) => vrnt.vrnt_id === data.vrnt_id)
                  ?.variant_selecteds.map((vrnts) => {
                    const group = data.product.groups.find(
                      (group) => group.vgrp_id === vrnts.vgrp_id
                    );
                    const option = group?.options.find(
                      (optn) => optn.optn_id === vrnts.optn_id
                    );
                    return option?.name;
                  })
                  .map((optn) => (
                    <Badge>{optn}</Badge>
                  ))}
              </div>
            ) : undefined}
            <div className="col-span-2 flex space-x-2">
              <Currency
                value={
                  data.vrnt_id
                    ? data.product.variants.find(
                        (vrnts) => vrnts.vrnt_id === data.vrnt_id
                      )?.price
                    : data.product?.price
                }
              />
              <span>x {data.quantity}</span>
              <span>
                ={" "}
                {(data.vrnt_id
                  ? data.product.variants.find(
                      (vrnts) => vrnts.vrnt_id === data.vrnt_id
                    )?.price ?? 0
                  : data.product?.price) * data.quantity}
              </span>
            </div>
            <div className="col-span-2 flex items-center space-x-2">
              <span>{data.quantity}</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItemRemove;
