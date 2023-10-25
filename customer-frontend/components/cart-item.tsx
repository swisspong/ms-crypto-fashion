import Image from "next/image";
import { Bitcoin, CreditCard, Minus, Plus, Store, X } from "lucide-react";
import Currency from "./currency";
import IconButton from "./icon-button";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  useEditItemCart,
  useRemoveItemInCart,
} from "@/src/hooks/cart/mutations";
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
import { PaymentMethodFormat } from "@/src/types/enums/product";

interface CartItemProps {
  data: ICartItem;
  setSelecteds: Dispatch<SetStateAction<string[]>>;
  selecteds: string[];
  isNormalPay?: boolean | undefined;
}

const CartItem: React.FC<CartItemProps> = ({
  data,
  setSelecteds,
  selecteds,
  isNormalPay,
}) => {
  const { mutate, isSuccess } = useRemoveItemInCart();
  const editMutate = useEditItemCart();
  useEffect(() => {
    if (isSuccess) {
      toast.success("ลบรายการสำเร็จ!");
    }
  }, [isSuccess]);
  return (
    <li className="py-6 border-b list-none">
      <div className="flex relative">
        {/* {data.message ? (
          <>
            <div className="absolute inset-0 opacity-75 bg-background z-40 rounded-md flex justify-center items-center"></div>
            <p className="absolute inset-0 flex flex-col justify-center items-center text-sm font-medium text-destructive z-50">
              {data.message}
           
            </p>
          </>
        ) : undefined} */}
        <div className="self-center mr-2">
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
        <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
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
          {/* <Image
            fill
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
          /> */}
        </div>
        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="absolute z-10 right-0 top-0">
            <IconButton
              icon={<X size={15} />}
              onClick={() => mutate(data.item_id)}
            />
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

            <div className="mt-1 flex text-sm">
              {/* <p className="text-gray-500">
              gfdsf
              </p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
           dffsf   
            </p> */}
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
                  .map((optn, index) => (
                    <EditItemDialog key={index} optn={optn} data={data} />
                    // <Badge>{optn}</Badge>
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
              <Button
                variant={"outline"}
                className=" border rounded-md p-1 cursor-pointer"
                size={"sm"}
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
                <Plus className="h-4 w-4 " />
              </Button>
              <span>{data.quantity}</span>
              <Button
                variant={"outline"}
                className=" border rounded-md p-1 cursor-pointer"
                size={"sm"}
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
              >
                <Minus className="h-4 w-4 cursor-pointer" />
              </Button>
              <div className=" border rounded-md p-2">
                สินค้าในคลัง{" "}
                {data.vrnt_id
                  ? data.product.variants.find(
                      (vrnt) => vrnt.vrnt_id === data.vrnt_id
                    )?.stock
                  : data.product.stock}
              </div>

              {/* <Currency value={data.product.price} />
            <span>x {data.quantity}</span>
            <span>= {data.product.price * data.quantity}</span> */}
            </div>
            <div className="flex  space-x-2 py-1">
              <span className="font-medium">การชำระเงิน:</span>
              {data.product.payment_methods.map((payment, index) =>
                payment === PaymentMethodFormat.CREDIT ? (
                  <CreditCard key={index} />
                ) : (
                  <Bitcoin key={index} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
