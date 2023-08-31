"use client";

import { FC, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Currency from "./currency";
import { Button } from "./ui/button";
import { useCreateCheckout } from "@/src/hooks/checkout/mutations";
import { useRouter } from "next/router";
import { Checkbox } from "./ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { PaymentMethodFormat } from "@/src/types/enums/product";
interface Props {
  data: ICartItem[] | undefined;
  selecteds: string[];
  isNormalPay: boolean | undefined;
  paymentMethodHandler: (val: boolean | undefined) => void;
}
const Summary: FC<Props> = ({
  data,
  selecteds,
  isNormalPay,
  paymentMethodHandler,
}) => {
  const onSubmit = () => {};
  const router = useRouter();
  const checkoutMutate = useCreateCheckout();
  const checkedHandler = (checked: CheckedState, value: boolean) => {
    if (checked === true) {
      paymentMethodHandler(value);
    } else {
      paymentMethodHandler(undefined);
    }
  };
  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Items summary</h2>
      <div className="mt-6 space-y-4">
        <div className="border-t border-gray-200 space-y-4 pt-4">
          <div className="text-base font-medium text-gray-900 ">
            Payment method
          </div>
          <div className="items-top flex space-x-2">
            <Checkbox
              id="normal"
              checked={isNormalPay === true}
              onCheckedChange={(checked) => {
                checkedHandler(checked, true);
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="normal"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pay with credit card
              </label>
              {/* <p className="text-sm text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p> */}
            </div>
          </div>
          <div className="items-top flex space-x-2">
            <Checkbox
              id="wallet"
              checked={isNormalPay === false}
              onCheckedChange={(checked) => {
                checkedHandler(checked, false);
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="wallet"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pay with metamask wallet
              </label>
              {/* <p className="text-sm text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p> */}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Items total</div>
          <Currency
            value={data
              ?.filter((item) =>
                selecteds.some((itemId) => itemId === item.item_id)
              )
              .reduce(
                (prev, curr) =>
                  (curr.vrnt_id
                    ? (curr.product.variants.find(
                        (vrnts) => vrnts.vrnt_id === curr.vrnt_id
                      )?.price ?? 0) * curr.quantity
                    : curr.product.price * curr.quantity) + prev,
                0
              )}
          />
        </div>
      </div>
      <Button
        disabled={selecteds.length <= 0 || isNormalPay === undefined}
        onClick={() =>
          checkoutMutate
            .mutateAsync({
              items: selecteds,
              payment_method: isNormalPay
                ? PaymentMethodFormat.CREDIT
                : PaymentMethodFormat.WALLET,
            })
            .then((result) => router.push("/checkout/" + result.chkt_id))
        }
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
