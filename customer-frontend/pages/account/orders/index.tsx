"use client";

import { useEffect, useMemo, useState } from "react";

import CartItem from "@/components/cart-item";
import Container from "@/components/container";
import Summary from "@/components/summary";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Checkbox } from "@/components/ui/checkbox";
import { Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/account/profile-form";
import { SidebarNav } from "@/components/account/sidebar-nav";
import { DataTable } from "@/components/data-table";
import { PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { columns } from "@/components/order/column";
import { useGetOrdersPolling, useMyOrders } from "@/src/hooks/order/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormCommentDialog from "@/components/order/form-dialog-comment";
import { useCreateCommnt } from "@/src/hooks/comment/mutations";
import { useUserInfo } from "@/src/hooks/user/queries";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { PaymentFormat, StatusFormat } from "@/src/types/enums/order";
const OrderListPage = () => {
  const router = useRouter();
  // TODO: Set column in DataTable
  const [idToUpdate, setIdToUpdate] = useState<string>();
  const [rating_mcht, setRatingMcht] = useState<number>(0);
  const [mchtId, setIdMcht] = useState<string>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [items, setItems] = useState<Item[] | undefined>(undefined);
  const { mutate: commentsHandler, isLoading, isSuccess } = useCreateCommnt();
  const [username, setUsername] = useState<string | undefined>(undefined);

  const {
    data: me,
    isLoading: meLoading,
    isSuccess: meSuccess,
    isError,
  } = useUserInfo();

  const orderPolling = useGetOrdersPolling();
  const openDialogHandlerParam = (open: boolean) => {
    if (!open) {
      setIdHandler(undefined, undefined);
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
      setIdHandler(undefined, undefined);
    }
    setOpen(con);
  };
  const setIdHandler = (id: string | undefined, mcht: string | undefined) => {
    setIdToUpdate(id);
    setIdMcht(mcht);
  };

  // * set Data Item
  const setDataItems = (body: Item[]) => {
    setItems(body);
  };

  // * comment handler
  const commentHandler = async (body: TComment[]) => {
    const payload: TCommentPayload = await {
      comments: body,
      mcht_id: mchtId!,
      order_id: idToUpdate!,
      rating_mcht: rating_mcht,

      user_name: me?.username!,
    };
    commentsHandler(payload);
  };





  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const defaultData = useMemo(() => [], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const dataQuery = useMyOrders({ page: pageIndex + 1, per_page: pageSize });

  // console.log(dataQuery.data)
  // useEffect(() => {
  //   orderPolling.refetch()
  // }, [])

  useEffect(() => {
    console.log(orderPolling.data);
    if (orderPolling.isSuccess && orderPolling.data.refetch) {
      dataQuery.refetch();
      orderPolling.refetch();
    }
  }, [orderPolling.isSuccess, orderPolling.data]);
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="sm:px-6 lg:px-8 min-h-screen">
          <div
            //className="hidden space-y-6 p-10 pb-16 md:block"
            className="space-y-6 p-3 sm:p-10 pb-16"
          >
            <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">
                รายการคำสั่งซื้อ
              </h2>
              <p className="text-muted-foreground">จัดการการคำสั่งซื้อของคุณ</p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <SidebarNav />
              </aside>
              <div className="flex-1 lg:max-w-4xl">
                {" "}
                <div className="space-y-6">
                  {dataQuery.data?.data.map((orderItem) => (
                    <div
                      key={orderItem.order_id}
                      className="px-2 mb-1 block md:hidden"
                      onClick={(e) => {
                        router.push(`orders/${orderItem.order_id}`);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={orderItem.items[0].image}
                          className="object-cover h-14 w-14 rounded-md"
                        />
                        <div className="w-full border-b pb-1 space-y-1">
                          <div className="flex justify-between text-sm">
                            <p className="line-clamp-1 text-sm mb-1">
                              {orderItem.recipient}
                            </p>
                            <div className="whitespace-nowrap">
                              <div className="flex justify-start items-center whitespace-nowrap">
                                <Badge
                                  className={`text-xs ${
                                    orderItem.payment_status ===
                                    PaymentFormat.PAID
                                      ? "bg-[#adfa1d]"
                                      : "bg-red-400"
                                  } rounded-e-none border border-r  ${
                                    orderItem.payment_status ===
                                    PaymentFormat.PAID
                                      ? "text-black"
                                      : "text-white"
                                  } hover:${
                                    orderItem.payment_status ===
                                    PaymentFormat.PAID
                                      ? "bg-[#adfa1d]"
                                      : "bg-red-400"
                                  }`}
                                >
                                  {orderItem.payment_status === "paid"
                                    ? "จ่ายแล้ว"
                                    : undefined}
                                  {orderItem.payment_status === "refund"
                                    ? "คืนเงิน"
                                    : orderItem.payment_status === "pending"
                                    ? "รอดำเนินการ"
                                    : orderItem.payment_status === "in_progress"
                                    ? "กำลังดำเนินการ"
                                    : undefined}
                                  {/* {orderItem.payment_status.toUpperCase()} */}
                                </Badge>
                                <Badge
                                  className={`text-xs ${
                                    orderItem.status ===
                                      StatusFormat.FULLFILLMENT ||
                                    orderItem.status === StatusFormat.RECEIVED
                                      ? "bg-[#adfa1d]"
                                      : "bg-red-400"
                                  } rounded-s-none border border-l hover:${
                                    orderItem.status ===
                                      StatusFormat.FULLFILLMENT ||
                                    orderItem.status === StatusFormat.RECEIVED
                                      ? "bg-[#adfa1d]"
                                      : "bg-red-400"
                                  }  ${
                                    orderItem.status ===
                                      StatusFormat.FULLFILLMENT ||
                                    orderItem.status === StatusFormat.RECEIVED
                                      ? "text-black"
                                      : ""
                                  }`}
                                >
                                  {orderItem.status ===
                                  StatusFormat.FULLFILLMENT
                                    ? "สมบูรณ์"
                                    : orderItem.status === StatusFormat.RECEIVED
                                    ? "รับสินค้าแล้ว"
                                    : undefined}
                                  {orderItem.status === "not fullfillment"
                                    ? "ยังไม่สมบูรณ์"
                                    : orderItem.status === "cancel"
                                    ? "ยกเลิก"
                                    : undefined}
                                  {/* {row.original.status.toUpperCase()} */}
                                </Badge>
                                {/* <div className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
                    
                                PAID
                              </div> */}
                                {/* <div>{moment(row.original.created_at).format("hh:mm a")}</div> */}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <p className="text-xs">
                              {moment(orderItem.createdAt).format(
                                "MMM DD, YYYY hh:mm a"
                              )}
                            </p>

                            {/* <div>
                              <p className="text-xs justify-self-end text-right">
                                x{orderItem.items[0].quantity}
                              </p>
                            </div> */}
                            <p className="text-xs justify-self-end font-medium">
                              ฿{orderItem.total.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              className=""
                              size={"sm"}
                              onClick={async (e) => {
                                e.stopPropagation();
                                const items = orderItem.items;
                                const seenIds = new Set();
                                const data: Item[] = [];
                                const filteredItems = await items.filter(
                                  (item) => {
                                    if (seenIds.has(item.prod_id)) {
                                      return false; // ไม่รวม item ที่ซ้ำกันในผลลัพธ์
                                    }
                                    seenIds.add(item.prod_id);
                                    data.push(item);
                                    return true;
                                  }
                                );
                                // console.log(filteredItems)

                                await setDataItems(data);
                                setIdHandler(
                                  orderItem.order_id as string,
                                  orderItem.mcht_id as string
                                );
                                openSheetHandler();
                              }}
                              variant="outline"
                              key={orderItem.order_id}
                            >
                              แสดงความคิดเห็น
                            </Button>
                          </div>
                          {/* <div className="flex justify-end border-b">
                            <p className="text-xs justify-self-end font-medium">
                              ฿{orderItem.total.toFixed(2)}
                            </p>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  ))}
                  {dataQuery?.data && dataQuery?.data.data.length <= 0 ? (
                    <div className="px-2 mb-1 block md:hidden ">
                      <div className="flex items-center justify-center space-x-3 w-full border-y h-10">
                        <p>ไม่มีข้อมูล</p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <DataTable
                    title="รายการคำสั่งซื้อทั้งหมด"
                    setPagination={setPagination}
                    columns={columns({
                      openSheetHandler,
                      setIdHandler,
                      openDialogHandler,
                      setDataItems,
                    })}
                    responsive={true}
                    data={dataQuery.data?.data ?? defaultData}
                    pagination={pagination}
                    pageCount={dataQuery.data?.total_page ?? -1}
                    onRowClick={(data) =>
                      router.push(`orders/${data.order_id}`)
                    }
                  />
                  {/* <ProfileForm /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <FormCommentDialog
          data={items!}
          open={open}
          commentHandler={commentHandler}
          ratingHandle={(rating) => {
            setRatingMcht(rating)
          }}
          openHandler={openSheetHandlerParam}
          isLoading={isLoading}
          isSuccess={isLoading}
        />
      </Container>
      <Footer />
    </div>
  );
};

export default OrderListPage;
