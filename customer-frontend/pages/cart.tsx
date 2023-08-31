"use client";

import { useEffect, useState } from "react";

import CartItem from "@/components/cart-item";
import Container from "@/components/container";
import Summary from "@/components/summary";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "lucide-react";
import { useMyCart } from "@/src/hooks/cart/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import dynamic from "next/dynamic";
import { PaymentMethodFormat } from "@/src/types/enums/product";
const RemoveItemDialog = dynamic(
  () => import("@/components/remove-item-dialog"),
  { ssr: false }
);
const formSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const CartPage = () => {
  const [selecteds, setSelecteds] = useState<string[]>([]);
  const [isNormalPay, setIsNormalPay] = useState<boolean | undefined>();
  const paymentMethodHandler = (val: boolean | undefined) => {
    setSelecteds([])
    setIsNormalPay(val);
  };
  const { data } = useMyCart();
  useEffect(() => {
    console.log(selecteds);
  }, [selecteds]);
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
          <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {data?.length === 0 && (
                <p className="text-neutral-500 flex justify-center">
                  No items added to cart.
                </p>
              )}
              {data
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
                .map((item) => (
                  <CartItem
                    data={item}
                    setSelecteds={setSelecteds}
                    selecteds={selecteds}
                    isNormalPay={isNormalPay}
                  />
                ))}
            </div>
            <Summary
              selecteds={selecteds}
              data={data}
              isNormalPay={isNormalPay}
              paymentMethodHandler={paymentMethodHandler}
            />
          </div>
        </div>
        <RemoveItemDialog data={data?.filter((item) => item.message)} />
      </Container>

      <Footer />
    </div>
  );
};

export default CartPage;
