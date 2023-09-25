import Image from "next/image";
import { Inter } from "next/font/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import MetaMask from "@/components/meta-mask";
import Container from "@/components/container";
import Billboard from "@/components/billboard";
import Navbar from "@/components/navbar";
import * as z from "zod";
import ProductList from "@/components/product-list";
import Footer from "@/components/footer";
import MobileFilters from "@/components/mobile-filter";
import Filter from "@/components/filter";
import ProductCard from "@/components/product-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store, Truck } from "lucide-react";
import { Form } from "@/components/ui/form";
import {
  useGetOrderById,
  useGetOrderByIdPolling,
} from "@/src/hooks/order/queries";
import { useRouter } from "next/router";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PaymentFormat, StatusFormat } from "@/src/types/enums/order";
import ButtonCancelOrder from "@/components/order/button-cancel-order";
import { useEffect } from "react";
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .trim()
    .min(2, { message: "Description must be at least 2 characters." }),
  image_url: z.string().url(),
});
const inter = Inter({ subsets: ["latin"] });

export default function Order() {
  const router = useRouter();
  const dataQuery = useGetOrderById(router.query.orderId as string);
  const orderPolling = useGetOrderByIdPolling(router.query.orderId as string);
  useEffect(() => {
    if (orderPolling.isSuccess && orderPolling.data.refetch) {
      dataQuery.refetch();
      orderPolling.refetch();
    }
  }, [orderPolling.isSuccess, orderPolling.data?.refetch]);
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        {/* <Billboard />s */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-24">
          <div className="space-between flex items-center mb-4">
            <div className="">
              <h1 className="text-xl font-bold tracking-tight">
                Order #{dataQuery.data?.order_id}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 grid gap-4">
              <Card>
                <CardHeader className="space-y-1 flex-row  w-full justify-between items-center">
                  <CardTitle className="text-2xl">Details</CardTitle>
                  <div className="flex space-x-2">
                    {dataQuery.data?.status !== StatusFormat.FULLFILLMENT &&
                    dataQuery.data?.status !== StatusFormat.CANCEL ? (
                      // <Button variant={"destructive"} size={"sm"}>
                      //   Cancel Order
                      // </Button>
                      <ButtonCancelOrder />
                    ) : undefined}
                    {/* <Button variant={"destructive"} size={"sm"}>
                          Cancel Order
                        </Button> */}
                    {/* <Button variant={"outline"} size={"sm"}>
                          Refund
                        </Button> */}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                    <div className="flex-col">
                      <p className="text-xs">REFERENCE</p>
                      <p className="text-sm">{dataQuery.data?.order_id}</p>
                    </div>
                    <div className="flex-col items-end">
                      <p className="text-xs text-end">PLACED</p>
                      <p className="text-sm">
                        {moment(dataQuery?.data?.createdAt).format(
                          "MM/DD/YYYY"
                        )}{" "}
                        @ {moment(dataQuery?.data?.createdAt).format("hh:mm A")}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                    <div className="flex-col">
                      <p className="text-xs">Merchant</p>
                      <div className="flex items-center space-x-2">
                        <Store size={15} />
                        <p className="text-sm">{dataQuery.data?.mcht_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">PRODUCT</TableHead>
                          <TableHead>QTY</TableHead>
                          <TableHead>PRICE</TableHead>
                          <TableHead className="text-right">AMOUNT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataQuery.data?.items.map((orderItem) => (
                          <TableRow>
                            <TableCell className="font-medium">
                              <div>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={orderItem.image}
                                    className="object-cover h-14 w-14 rounded-md"
                                  />
                                  <div>
                                    <div className="text-sm flex space-x-1 items-center mb-1">
                                      <span>{orderItem.name}</span>
                                    </div>
                                    <div className="flex gap-0.5 flex-wrap">
                                      {orderItem.variant.map((variant) => (
                                        <Badge className="text-xs">
                                          {variant.option_name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{orderItem.quantity}</TableCell>
                            <TableCell>{orderItem.price}</TableCell>
                            <TableCell className="text-right">
                              ฿{orderItem.total.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="rounded-md border mb-4">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Subtotal"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            ฿{dataQuery.data?.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Shipping"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            ฿{"0.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Total paid"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            ฿{dataQuery.data?.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              {!dataQuery.data?.shipping_carier ? (
                <Card>
                  <CardHeader className="space-y-1 flex-row  w-full justify-between items-center">
                    <CardTitle className="text-2xl">Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Alert variant={"destructive"}>
                      <Terminal className="h-4 w-4" />
                      <AlertTitle className="text-center">
                        Not Shipping
                      </AlertTitle>
                    </Alert>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="space-y-1 flex-row  w-full justify-between items-center">
                    <CardTitle className="text-2xl">Shipment</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex p-3 flex-col space-y-4">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                        <div className="flex justify-center">
                          <Truck className="w-8 h-8" />
                        </div>
                        <div className="flex-col items-end">
                          <p className="text-xs text-end">DATE SHIPPED</p>
                          <p className="text-sm">
                            {" "}
                            {moment(dataQuery?.data?.shipped_at).format(
                              "MM/DD/YYYY"
                            )}{" "}
                            @{" "}
                            {moment(dataQuery?.data?.shipped_at).format(
                              "hh:mm A"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                        <div className="flex-col">
                          <p className="text-xs">
                            {" "}
                            {dataQuery.data?.shipping_carier
                              ?.split(" ")
                              .map(
                                (text) =>
                                  text.substring(0, 1).toUpperCase() +
                                  text.substring(1)
                              )
                              .join(" ")}
                          </p>
                          <p className="text-sm">
                            TRACKING #{dataQuery.data?.tracking}
                          </p>
                        </div>
                      </div>
                      {/* <div className="rounded-md border w-full">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="">PRODUCT</TableHead>
                                  <TableHead className="text-right">
                                    QTY
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={
                                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                                        }
                                        className="object-cover h-14 w-14 rounded-md"
                                      />
                                      <div>{"watch"}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {"2"}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div> */}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex flex-col col-span-2 gap-4">
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    {/* <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Order Status"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center">
                              <div className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none  no-underline group-hover:no-underline">
                                {"PAID"}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow> */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>{"Fullfillment"}</div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center">
                          {dataQuery.data?.status ===
                          StatusFormat.FULLFILLMENT ? (
                            <Badge className="bg-[#adfa1d] text-foreground hover:bg-[#adfa1d]">
                              {dataQuery.data.status.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-400 hover:bg-red-400">
                              {dataQuery?.data?.status.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>{"Payment"}</div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center">
                          {dataQuery.data?.payment_status ===
                          PaymentFormat.PAID ? (
                            <Badge className="bg-[#adfa1d] text-foreground hover:bg-[#adfa1d]">
                              {dataQuery.data.payment_status.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-400 hover:bg-red-400">
                              {dataQuery?.data?.payment_status.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* <Card>
                    <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                      <CardTitle className="text-lg">Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <p className="font-medium">swiss</p>
                      <p className="">swiss@gmail.com</p>
                      <p className="">0944070021</p>
                    </CardContent>
                  </Card>
                  <div>
                    <Card>
                      <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                        <CardTitle className="text-lg">
                          Payment Mehtod
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="">
                        <p className="">Qr Propmtpay</p>
                        <p className="text-muted-foreground text-xs">
                          CAPTURED: 02/08/2023 @ 4:38 AM
                        </p>
                      </CardContent>
                    </Card>
                  </div> */}
              <Card>
                <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                  <CardTitle className="text-lg">Address</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="flex space-x-2">
                    <p className="font-medium">{dataQuery.data?.recipient}</p>
                    <div>|</div>
                    <p className="font-normal text-card-foreground">
                      {dataQuery.data?.tel_number}
                    </p>
                  </div>
                  <p className="">{dataQuery.data?.address}</p>
                  <p className="font-normal">{dataQuery.data?.post_code}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
