
import Container from "@/components/container";
import Summary from "@/components/summary";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Loader2, Store } from "lucide-react";
import * as z from "zod";
import dynamic from "next/dynamic";
import RemoveItemAllertDialog from "@/components/cart/remove-item-allert-dialog";

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
                        selecteds={selecteds}
                        isNormalPay={isNormalPay}
                      />
                    </>
                  ))}
                </>
              )}
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

