"use client";

import { useEffect, useState } from "react";

import CartItem from "@/components/cart-item";
import Container from "@/components/container";
import Summary from "@/components/summary";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Store } from "lucide-react";
import { useMyCart } from "@/src/hooks/cart/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import dynamic from "next/dynamic";
import { PaymentMethodFormat } from "@/src/types/enums/product";
import RemoveItemAllertDialog from "@/components/cart/remove-item-allert-dialog";
import CartDataTable from "@/components/cart/cart-data-table";

import useCartHook from "@/components/cart/use-cart-hook";
import CartItemNew from "@/components/cart/cart-item/cart-item-new";
import { withUser } from "@/src/hooks/auth/auth-hook";
const RemoveItemDialog = dynamic(
  () => import("@/components/remove-item-dialog"),
  { ssr: false }
);
const formSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export default function CartPage() {
  // const [selecteds, setSelecteds] = useState<string[]>([]);
  // const [isNormalPay, setIsNormalPay] = useState<boolean | undefined>();
  // const paymentMethodHandler = (val: boolean | undefined) => {
  //   setSelecteds([]);
  //   setIsNormalPay(val);
  // };
  // const { data } = useMyCart();
  // useEffect(() => {
  //   console.log(selecteds);
  // }, [selecteds]);
  const {
    filterItemByPayementMethod,
    cartItems,
    cartItemsLoading,
    selecteds,
    isNormalPay,
    paymentMethodHandler,
    onCheckedHandler,
  } = useCartHook();
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
          <h1 className="text-3xl font-bold text-black">รถเข็น</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cartItemsLoading ? (
                <p className="text-neutral-500 flex justify-center">
                  <Loader2 className="animate-spin" />
                </p>
              ) : (
                <>
                  {cartItems?.items?.length === 0 && (
                    <p className="text-neutral-500 flex justify-center">
                      ไม่มีสินค้าเพิ่มลงในรถเข็น
                    </p>
                  )}
                  {filterItemByPayementMethod.map((item) => (
                    <>
                      <CartItemNew
                        data={item}
                        onCheckedHandler={onCheckedHandler}
                        // setSelecteds={setSelecteds}

                        selecteds={selecteds}
                        isNormalPay={isNormalPay}
                      />
                    </>
                  ))}
                </>
              )}

              {/* {data?.items?.length === 0 && (
                <p className="text-neutral-500 flex justify-center">
                  ไม่มีสินค้าเพิ่มลงในรถเข็น
                </p>
              )}
              {data?.items
                ?.filter(
                  (item) =>
                    isNormalPay === undefined ||
                    (isNormalPay === true &&
                      item.product.payment_methods.includes(
                        PaymentMethodFormat.CREDIT
                      )) ||
                    (isNormalPay === false &&
                      item.product.payment_methods.includes(
                        PaymentMethodFormat.WALLET
                      ))
                )
                ?.map((item) => (
                  <>
                    <CartItemNew
                      data={item}
                      setSelecteds={setSelecteds}
                      selecteds={selecteds}
                      isNormalPay={isNormalPay}
                    />
                    <CartItem
                      data={item}
                      setSelecteds={setSelecteds}
                      selecteds={selecteds}
                      isNormalPay={isNormalPay}
                    />
                  </>
                ))} */}
            </div>
            <Summary
              selecteds={selecteds}
              data={cartItems?.items}
              isNormalPay={isNormalPay}
              paymentMethodHandler={paymentMethodHandler}
            />
          </div>
        </div>
        <RemoveItemAllertDialog data={cartItems?.errorItems} />
      </Container>

      <Footer />
    </div>
  );
}
export const getServerSideProps = withUser();

