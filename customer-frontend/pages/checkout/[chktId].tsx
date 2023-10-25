"use client";

import { useEffect, useState } from "react";

import CartItem from "@/components/cart-item";
import Container from "@/components/container";
import Summary from "@/components/summary";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, MapPinIcon, Store } from "lucide-react";
import { useMyCart } from "@/src/hooks/cart/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/components/payment-method";
import Currency from "@/components/currency";
//import CheckoutItem from "@/components/checkout-item";
import { useGetCheckoutById } from "@/src/hooks/checkout/queries";
import { useRouter } from "next/router";
import { useMyAddress } from "@/src/hooks/address/queries";
import AddressListDialog from "@/components/account/address-list-dialog";
import RemoveCheckoutAlertDialog from "@/components/checkout/remove-checkout-alert-dialog";
import Link from "next/link";
import CheckoutItem from "@/components/checkout/checkout-item";

const formSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const CheckoutPage = () => {
  const router = useRouter();
  // const [addressDialog, setAddressDialog] = useState(false);
  const [selecteds, setSelecteds] = useState<string[]>([]);
  const [addressSelected, setAddressSelected] = useState<string | undefined>();
  useEffect(() => {
    console.log(selecteds);
  }, [selecteds]);

  const getCheckout = useGetCheckoutById(router.query.chktId as string);
  const addresses = useMyAddress();
  useEffect(() => {
    if (addresses.isSuccess) {
      if (addresses.data.length > 0) {
        setAddressSelected(addresses.data[0].addr_id);
      }
      if (addresses.data.length <= 0) {
        setAddressSelected(undefined);
      }
    }
  }, [addresses.isSuccess, addresses.data?.length]);
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
          <h1 className="text-3xl font-bold text-black">เช็คเอาท์</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {addressSelected ? (
                <Card className="mb-3">
                  <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                    <CardTitle>
                      <MapPinIcon className="h-4 w-4 mr-2" />
                    </CardTitle>
                    <div className="flex justify-between w-full">
                      <div className="flex items-center">
                        <div className="flex space-x-2 items-center">
                          <p className="font-medium">
                            {
                              addresses.data?.find(
                                (address) => address.addr_id === addressSelected
                              )?.recipient
                            }
                          </p>
                          <div>|</div>
                          <p className="font-normal text-sm">
                            {
                              addresses.data?.find(
                                (address) => address.addr_id === addressSelected
                              )?.tel_number
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <AddressListDialog
                      selected={addressSelected}
                      setAddressSelected={setAddressSelected}
                    />
                  </CardHeader>
                  <CardContent className="">
                    <p className="text-sm text-foreground">
                      {
                        addresses.data?.find(
                          (address) => address.addr_id === addressSelected
                        )?.address
                      }
                    </p>
                    <p className="text-sm">
                      {
                        addresses.data?.find(
                          (address) => address.addr_id === addressSelected
                        )?.post_code
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-2">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">ที่อยู่</h3>
                        <p className="text-sm text-muted-foreground">
                          เพิ่มที่อยู่ของคุณเพื่อดำเนินการชำระเงินให้สำเร็จ
                        </p>
                      </div>
                      {/* <Link href={"/account/address"}>
                        <Button variant="outline">เพิ่มที่อยู่</Button>
                      </Link> */}
                      <div>
                        <AddressListDialog
                          selected={addressSelected}
                          setAddressSelected={setAddressSelected}
                        />
                      </div>

                      {/* <AddAddressForm /> */}
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* <Card>
                <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                  <CardTitle className="text-lg">Address</CardTitle>
                  
                </CardHeader>
                <CardContent className="flex">
                  <div>
                    <p className="font-medium">swiss</p>
                    <p className="">
                      {`212/393 Pattanakarn Road Praves Praves Bangkok Phone number
                    662 3214368 Zip code 10250 
                    Thailand`}
                    </p>
                  </div>
                  <AddressListDialog />
                </CardContent>
              </Card> */}
              {getCheckout.data?.items?.length === 0 && (
                <p className="text-neutral-500 flex justify-center">
                  ไม่มีสินค้าเพิ่มลงในรถเข็น
                </p>
              )}
              {getCheckout.data?.items?.map((item) => (
                <CheckoutItem
                  key={item.item_id}
                  data={item}
                  setSelecteds={setSelecteds}
                  selecteds={selecteds}
                />
              ))}
            </div>
            {/* <Summary selecteds={selecteds} data={data} /> */}
            <div className="lg:col-span-5">
              <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6  lg:mt-0 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">
                  สรุปการสั่งซื้อ
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                      จำนวนสั่งซื้อรวม
                    </div>
                    <div className="font-semibold">
                      {getCheckout.data?.total_quantity}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                      ยอดรายการสั่งซื้อรวม
                    </div>
                    <Currency value={getCheckout.data?.total} />
                  </div>
                </div>
              </div>
              <PaymentMethod
                data={getCheckout.data}
                address={addresses.data?.find(
                  (address) => address.addr_id === addressSelected
                )}
              />
            </div>
          </div>
        </div>
      </Container>
      <Footer />
      <RemoveCheckoutAlertDialog data={getCheckout.data?.errorItems} />
    </div>
  );
};

export default CheckoutPage;
