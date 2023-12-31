import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import { Icons } from "@/components/icons";
import { columns } from "@/components/orders/column";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { PaginationState } from "@tanstack/react-table";
import { Plus, PlusCircle, Podcast, Truck, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/file-upload";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FullfillForm from "@/components/orders/fullfill-form";
import AddressForm from "@/components/orders/address-form";
import CustomerForm from "@/components/orders/customer-form";
import {
  useGetMerchantOrderById,
  useGetOneOrderPolling,
} from "@/src/hooks/order/queries";
import { useRouter } from "next/router";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { PaymentFormat, StatusFormat } from "@/src/types/enums/order";
import ButtonCancelOrder from "@/components/orders/button-cancel-order";
import ButtonRefundOrder from "@/components/orders/button-refund-order";
import { RadioGroup } from "@/components/ui/radio-group";
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
export default function EditOrder() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Jeans",
      description:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
    },
  });

  // TODO: Set column in DataTable
  const [idToUpdate, setIdToUpdate] = useState<string>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const openDialogHandlerParam = (open: boolean) => {
    if (!open) {
      setIdHandler(undefined);
    }
    setOpenDialog(open);
  };
  const openDialogHandler = () => {
    setOpenDialog((prev) => !prev);
  };
  const openSheetHandler = () => {
    setOpen((prev) => !prev);
  };

  const openSheetHandlerParam = (con: boolean) => {
    if (!con) {
      setIdHandler(undefined);
    }
    setOpen(con);
  };
  const setIdHandler = (id: string | undefined) => {
    setIdToUpdate(id);
  };

  const dataQuery = useGetMerchantOrderById(router.query.orderId as string);
  const orderPolling = useGetOneOrderPolling(router.query.orderId as string);

  useEffect(() => {
    console.log(orderPolling.data);
    if (orderPolling.isSuccess && orderPolling.data.refetch) {
      dataQuery.refetch();
      orderPolling.refetch();
    }
  }, [orderPolling.isSuccess, orderPolling.data?.refetch]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
  }

  return (
    <Layout>
      <div className="space-between flex items-center mb-4">
        <div className="">
          <h1 className="text-xl font-bold tracking-tight">
            รายละเอียดการสั่งซื้อ
          </h1>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 md:col-span-3 grid gap-2 md:gap-4">
              <Card>
                <CardHeader className="space-y-1 flex-row  w-full justify-between items-center p-2 md:p-6">
                  <CardTitle className="text-2xl">รายละเอียด</CardTitle>
                  <div className="flex space-x-2">
                    {dataQuery.data?.status !== StatusFormat.FULLFILLMENT &&
                    dataQuery.data?.status !== StatusFormat.RECEIVED &&
                    dataQuery.data?.status !== StatusFormat.CANCEL ? (
                      <ButtonCancelOrder />
                    ) : undefined}
                    {dataQuery.data?.payment_status !== PaymentFormat.REFUND &&
                    dataQuery.data?.status !== StatusFormat.RECEIVED ? (
                      <ButtonRefundOrder />
                    ) : undefined}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 p-2 md:p-6">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                    <div className="flex-col">
                      <p className="text-xs">อ้างอิง</p>
                      <p className="text-sm">{dataQuery.data?.order_id}</p>
                    </div>
                    <div className="flex-col items-end">
                      <p className="text-xs text-end">การสั่งซื้อ</p>
                      <p className="text-sm">
                        {" "}
                        {moment(dataQuery?.data?.createdAt).format(
                          "MM/DD/YYYY"
                        )}{" "}
                        @ {moment(dataQuery?.data?.createdAt).format("hh:mm A")}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md border mb-4">
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="">สินค้า</TableHead>
                            <TableHead>จำนวน</TableHead>
                            <TableHead>ราคา</TableHead>
                            <TableHead className="text-right">ยอดรวม</TableHead>
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
                                      <div className="flex">
                                        <div className="flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer">
                                          <span className="flex text-xs font-light items-center whitespace-nowrap sm:text-sm">
                                            ตัวเลือก:
                                          </span>
                                          <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                            {orderItem.variant
                                              .map((optn) => {
                                                return optn.option_name;
                                              })
                                              .join(", ")}
                                          </p>
                                        </div>
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
                              <div className="flex justify-end border-b pb-1">
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
                            <div>{"ยอดรวม"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            ฿{dataQuery.data?.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"ยอดสุทธิ"}</div>
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
                  <CardHeader className="space-y-1 flex-row  w-full justify-between items-center p-2 md:p-6">
                    <CardTitle className="text-2xl">
                      การเตรียมสินค้าไม่สมบูรณ์
                    </CardTitle>
                    <FullfillForm data={dataQuery.data} />
                  </CardHeader>
                  <CardContent className="grid gap-4 p-2 md:p-6">
                    <div className="rounded-md border mb-4">
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="">สินค้า</TableHead>
                              <TableHead className="text-right">
                                จำนวน
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
                                        <div className="text-sm flex space-x-1 items-center mb-1">
                                          <span>{orderItem.name}</span>
                                        </div>
                                        <div className="flex">
                                          <div className="flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer">
                                            <span className="flex text-xs font-light items-center whitespace-nowrap sm:text-sm">
                                              ตัวเลือก:
                                            </span>
                                            <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                              {orderItem.variant
                                                .map((optn) => {
                                                  return optn.option_name;
                                                })
                                                .join(", ")}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {orderItem.quantity}
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

                                <div className="flex justify-between pb-1 border-b">
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

                                  <div className="">
                                    <p className="text-xs justify-self-end text-right">
                                      x{orderItem.quantity}
                                    </p>
                                  </div>
                                </div>
                                
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="space-y-1 flex-row  w-full justify-between items-center p-2 md:p-6">
                    <CardTitle className="text-2xl">การจัดส่ง</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 p-2 md:p-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex p-3 flex-col space-y-4">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                        <div className="flex justify-center">
                          <Truck className="w-8 h-8" />
                        </div>
                        <div className="flex-col items-end">
                          <p className="text-xs text-end">วันที่จัดส่ง</p>
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
                            การติดตาม #{dataQuery.data?.tracking}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex flex-col col-span-5 md:col-span-2 gap-4">
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div>การเตรียมสินค้า</div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">
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
                        <div>การจ่ายเงิน</div>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">
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
        </form>
      </Form>
    </Layout>
  );
}
