import Image from "next/image";
import {
  Bitcoin,
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  Store,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useEditItemCart } from "@/src/hooks/cart/mutations";

import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { PaymentMethodFormat } from "@/src/types/enums/product";
import { ChevronDown } from "lucide-react";

interface CheckoutItemProps {
  data: Item;
  setSelecteds: Dispatch<SetStateAction<string[]>>;
  selecteds: string[];
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({
  data,
  setSelecteds,
  selecteds,
}) => {
  const router = useRouter();
  // const { mutate, isSuccess } = useRemoveCategory();
  const editMutate = useEditItemCart();
  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("Remove item success!");
  //   }
  // }, [isSuccess]);
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
        <div className="flex space-x-2 md:space-x-5  relative">
          <div className="flex items-center self-start space-x-2">
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
            {data.vrnt_id ? (
              <div className="flex">
                <div className="flex space-x-1 bg-muted rounded-sm cursor-pointer">
                  <span className="flex text-xs items-center whitespace-nowrap sm:text-sm">
                    ตัวเลือก:
                  </span>
                  <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
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
                      .map((optn) => {
                        return optn;
                      })
                      .join(", ")}
                  </p>
                  {/* <span className="flex text-xs items-center whitespace-nowrap sm:text-sm">
                    <ChevronDown size={10} />
                  </span> */}
                </div>
              </div>
            ) : undefined}
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
          </div>
        </div>
      </li>
      {/* <li className="py-6 border-b list-none">
        <div className="flex relative">
          {data.message ? (
            <>
              <div className="absolute inset-0 opacity-75 bg-background z-40 rounded-md flex justify-center items-center"></div>
              <p className="absolute inset-0 flex flex-col justify-center items-center text-sm font-medium text-destructive z-50">
                {data.message}
                <Button onClick={() => router.push("/cart")}>
                  Back to cart
                </Button>
              </p>
            </>
          ) : undefined}
          <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
            <img
              src={data.image}
              alt=""
              className="object-cover object-center"
            />
          </div>
          <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
              <div className="flex items-center space-x-2 border p-1 rounded-md">
                <Store size={15} />
                <span className="text-sm">{data.product?.merchant.name}</span>
              </div>
              <div></div>
              <div className="flex justify-between">
                <p className=" text-lg font-semibold text-black">{data.name}</p>
              </div>

              <div className="mt-1 flex text-sm">
            
              </div>
              {data.vrnt_id ? (
                <div className="col-span-2 flex space-x-2">
                  {data.variant?.map((vrnt) => (
                    <Badge>{vrnt.option_name}</Badge>
                  ))}
                </div>
              ) : undefined}
              <div className="col-span-2 flex space-x-2">
                <Currency value={data.price} />
                <span>x {data.quantity}</span>
                <span>= {data.total}</span>
              </div>
            </div>
          </div>
        </div>
      </li> */}
    </>
  );
};

export default CheckoutItem;
