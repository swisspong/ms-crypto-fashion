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
import { useReceiveOrder } from "@/src/hooks/order/mutations";
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
  const receiveOrder = useReceiveOrder();
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
        <div className="px-2 sm:px-6 lg:px-8 pt-4 pb-24">
          <div className="space-between flex items-center mb-4">
            <div className="">
              <h1 className="text-xl font-bold tracking-tight">
                หมายเลขคำสั่งซื้อ #{dataQuery.data?.order_id}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 md:col-span-3 grid gap-4">
              <Card className="">
                <CardHeader className="p-2 md:p-6 md:pb-0 space-y-1 flex-row  w-full justify-between items-center">
                  <CardTitle className="text-2xl">รายละเอียด</CardTitle>
                  <div className="flex space-x-2">
                    {dataQuery.data?.status === StatusFormat.FULLFILLMENT &&
                    dataQuery.data?.payment_status === PaymentFormat.PAID ? (
                      <Button
                        size={"sm"}
                        disabled={
                          receiveOrder.isLoading || receiveOrder.isSuccess
                        }
                        onClick={() =>
                          receiveOrder.mutate(router.query.orderId as string)
                        }
                      >
                        รับสินค้าแล้ว
                      </Button>
                    ) : undefined}

                    {dataQuery.data?.status !== StatusFormat.RECEIVED &&
                    dataQuery.data?.status !== StatusFormat.FULLFILLMENT &&
                    dataQuery.data?.status !== StatusFormat.CANCEL ? (
                      // <Button variant={"destructive"} size={"sm"}>
                      //   Cancel Order
                      // </Button>
                      <ButtonCancelOrder />
                    ) : undefined}
                  </div>
                </CardHeader>
                <CardContent className="p-2 md:p-6 grid gap-2 md:gap-4">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                    <div className="flex-col">
                      <p className="text-xs">อ้างอิง</p>
                      <p className="text-sm">{dataQuery.data?.order_id}</p>
                    </div>
                    <div className="flex-col items-end">
                      <p className="text-xs text-end">วัน/เวลา</p>
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
                      <p className="text-xs">ร้านค้า</p>
                      <div className="flex items-center space-x-2">
                        <Store size={15} />
                        <p className="text-sm">{dataQuery.data?.mcht_name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border mb-4">
                    {/* <Table className="hidden md:block">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">สินค้า</TableHead>
                          <TableHead className="text-right">จำนวน</TableHead>
                          <TableHead>ราคา</TableHead>
                          <TableHead className="text-right">ราคารวม</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dataQuery.data?.items.map((orderItem) => (
                          <TableRow>
                            <TableCell className="font-medium">
                              <div className="">
                                <div className="flex items-center space-x-3 ">
                                  <img
                                    src={orderItem.image}
                                    className="object-cover h-14 w-14 rounded-md"
                                  />
                                  <div>
                                    <p className="line-clamp-1 text-sm mb-1">
                                      {orderItem.name}
                                    </p>

                                    <div className="flex">
                                      <div className="flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer">
                                        {orderItem.variant.length > 0 ? (
                                          <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                            ตัวเลือก:
                                            {orderItem.variant
                                              .map((optn) => {
                                                return optn.option_name;
                                              })
                                              .join(", ")}
                                          </p>
                                        ) : (
                                          <div></div>
                                        )}
                                      </div>
                                    </div>
                             
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {orderItem.quantity}
                            </TableCell>
                            <TableCell>{orderItem.price}</TableCell>
                            <TableCell className="text-right">
                              ฿{orderItem.total.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> */}
                    <div className="hidden md:block">
                      <Table className="">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="">สินค้า</TableHead>
                            <TableHead>จำนวน</TableHead>
                            <TableHead>ราคา</TableHead>
                            <TableHead className="text-right">
                              ราคารวม
                            </TableHead>
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
                                      <p className="line-clamp-1 text-sm mb-1">
                                        {orderItem.name}
                                      </p>

                                      <div className="flex">
                                        <div className="flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer">
                                          {orderItem.variant.length > 0 ? (
                                            <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                              ตัวเลือก:
                                              {orderItem.variant
                                                .map((optn) => {
                                                  return optn.option_name;
                                                })
                                                .join(", ")}
                                            </p>
                                          ) : (
                                            <div></div>
                                          )}
                                        </div>
                                      </div>
                                      {/* <div className="flex gap-0.5 flex-wrap">
                                      {orderItem.variant.map((variant) => (
                                        <Badge className="text-xs">
                                          {variant.option_name}
                                        </Badge>
                                      ))}
                                    </div> */}
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
                    <div className="pt-1">
                      {dataQuery.data?.items.map((orderItem) => (
                        <div className="px-2 mb-1 block md:hidden ">
                          <div className="flex items-center space-x-3">
                            <img
                              src={orderItem.image}
                              className="object-cover h-14 w-14 rounded-md"
                            />
                            <div className="w-full">
                              <p className="line-clamp-1 text-sm mb-1">
                                {orderItem.name}
                              </p>

                              <div className="flex justify-between">
                                {orderItem.variant.length > 0 ? (
                                  <div
                                    className={`flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer`}
                                  >
                                    <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                      ตัวเลือก:
                                      {orderItem.variant
                                        .map((optn) => {
                                          return optn.option_name;
                                        })
                                        .join(", ")}
                                    </p>
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                                {/* <div
                                  className={`flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer`}
                                >
                                  <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                    ตัวเลือก:
                                    {orderItem.variant
                                      .map((optn) => {
                                        return optn.option_name;
                                      })
                                      .join(", ")}
                                  </p>
                                </div> */}

                                <div>
                                  <p className="text-xs justify-self-end text-right">
                                    x{orderItem.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end border-b">
                                <p className="text-xs justify-self-end font-medium">
                                  ฿{orderItem.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border mb-4">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"ราคารวม"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            ฿{dataQuery.data?.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"ราคาจัดส่ง"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            ฿{"0.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"สรุปราคา"}</div>
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
                  <CardHeader className="p-2 md:p-6 space-y-1 flex-row  w-full justify-between items-center">
                    <CardTitle className="text-2xl">การจัดส่ง</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 md:p-6 grid gap-4">
                    <Alert variant={"destructive"}>
                      <Terminal className="h-4 w-4" />
                      <AlertTitle className="text-center">
                        ยังไม่จัดส่ง
                      </AlertTitle>
                    </Alert>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="space-y-1 flex-row  w-full justify-between items-center px-2 md:px-6 pt-2 md:pt-6 pb-1">
                    <CardTitle className="text-2xl">การจัดส่ง</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 px-2 md:px-6  pb-2 md:pb-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex p-3 flex-col space-y-4">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                        <div className="flex justify-center">
                          <Truck className="w-8 h-8" />
                        </div>
                        <div className="flex-col items-end">
                          <p className="text-xs text-end">วัน/เวลา จัดส่ง</p>
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
                            หมายเลขติดตาม #{dataQuery.data?.tracking}
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
            <div className="flex flex-col col-span-5 md:col-span-2 gap-4">
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
                        <div>{"สถานะร้านค้า"}</div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">
                        {/* <div className="flex justify-end items-center">
                          {dataQuery.data?.status ===
                          StatusFormat.FULLFILLMENT || dataQuery.data?.status ===
                          StatusFormat.RECEIVED ? (
                            <Badge className="bg-[#adfa1d] text-foreground hover:bg-[#adfa1d]">
                              {dataQuery.data.status.toUpperCase()}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-400 hover:bg-red-400">
                              {dataQuery?.data?.status.toUpperCase()}
                            </Badge>
                          )}
                        </div> */}
                        <div className="flex justify-end items-center">
                          {dataQuery.data?.status ===
                            StatusFormat.FULLFILLMENT ||
                          dataQuery.data?.status === StatusFormat.RECEIVED ? (
                            <Badge className="bg-[#adfa1d] text-foreground hover:bg-[#adfa1d]">
                              {/* {dataQuery.data.status.toUpperCase()} */}
                              {dataQuery.data?.status ===
                              StatusFormat.FULLFILLMENT
                                ? "สมบูรณ์"
                                : dataQuery.data?.status ===
                                  StatusFormat.RECEIVED
                                ? "รับสินค้าแล้ว"
                                : undefined}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-400 hover:bg-red-400">
                              {/* {dataQuery?.data?.status.toUpperCase()} */}
                              {dataQuery?.data?.status === "not fullfillment"
                                ? "ยังไม่สมบูรณ์"
                                : dataQuery?.data?.status === "cancel"
                                ? "ยกเลิก"
                                : undefined}
                              {/* ไม่สมบูรณ์ */}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>{"สถานะการชำระเงิน "}</div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">
                        {/* <div className="flex justify-end items-center">
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
                        </div> */}
                        <div className="flex justify-end items-center">
                          {dataQuery.data?.payment_status ===
                          PaymentFormat.PAID ? (
                            <Badge className="bg-[#adfa1d] text-foreground hover:bg-[#adfa1d]">
                              {/* {dataQuery.data.payment_status.toUpperCase()} */}
                              จ่ายแล้ว
                            </Badge>
                          ) : (
                            <Badge className="bg-red-400 hover:bg-red-400">
                              {/* {dataQuery?.data?.payment_status.toUpperCase()} */}
                              {dataQuery?.data?.payment_status === "refund"
                                ? "คืนเงิน"
                                : dataQuery?.data?.payment_status === "pending"
                                ? "รอดำเนินการ"
                                : dataQuery?.data?.payment_status ===
                                  "in_progress"
                                ? "กำลังดำเนินการ"
                                : undefined}
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
                <CardHeader className="px-2 md:px-6 pb-1 space-y-1 flex-row  w-full justify-between items-center pt-2 md:pt-6">
                  <CardTitle className="text-lg">ที่อยู่</CardTitle>
                </CardHeader>
                <CardContent className="px-2 md:px-6 pb-2 md:pb-6">
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
              <Card>
                <CardHeader className="px-2 md:px-6 -space-y-1 flex-row  w-full justify-between items-center pb-1 pt-2 md:pt-6">
                  <CardTitle className="text-lg">ช่องทางการชำระเงิน</CardTitle>
                  {/* <CustomerForm /> */}
                </CardHeader>
                <CardContent className="px-2 md:px-6 grid gap-6 pb-2 md:pb-6">
                  <div className="grid grid-cols-3 gap-4">
                    {dataQuery?.data && dataQuery.data.wei > 0 ? (
                      <div className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <Icons.metamask className="mb-3 h-6 w-6" />
                        Metamask
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="mb-3 h-6 w-6"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                        Card
                      </div>
                    )}
                  </div>
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
