import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import DialogDelete from "@/components/dialog-delete";
import { columns } from "@/components/orders/column";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import RoleForm from "@/components/roles/role-form";
import { Separator } from "@/components/ui/separator";
import { useMerchantOrders } from "@/src/hooks/order/queries";
import { PaymentFormat, StatusFormat } from "@/src/types/enums/order";
import { PaginationState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Orders() {
  const router = useRouter();
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
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const dataQuery: { data: { data: IOrderRow[]; total_page: number } } = {
  //   data: {
  //     data: [
  //       {
  //         id: "cat_1",
  //         image:
  //           "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
  //         amount: 20,
  //         created_at: "2023-06-15T08:39:59.434Z",
  //         email: "swiss@gmail.com",
  //         status: "NOT PAID",
  //       },
  //     ],
  //     total_page: 1,
  //   },
  // };
  const dataQuery = useMerchantOrders({
    page: pageIndex + 1,
    per_page: pageSize,
  });
  const defaultData = useMemo(() => [], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // !!! END DataTable

  return (
    <Layout>
      <h3 className="text-lg font-semibold leading-none tracking-tight mb-3">
        รายการคำสั่งซื้อทั้งหมด
      </h3>
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
            <div className="w-full border-b pb-1 space-y-2">
              <div className="flex justify-between text-sm">
                <p className="line-clamp-1 text-sm mb-1">
                  {orderItem.recipient}
                </p>
                <div className="whitespace-nowrap">
                  <div className="flex justify-start items-center whitespace-nowrap">
                    <Badge
                      className={`text-xs ${
                        orderItem.payment_status === PaymentFormat.PAID
                          ? "bg-[#adfa1d]"
                          : "bg-red-400"
                      } rounded-e-none border border-r  ${
                        orderItem.payment_status === PaymentFormat.PAID
                          ? "text-black"
                          : "text-white"
                      } hover:${
                        orderItem.payment_status === PaymentFormat.PAID
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
                        orderItem.status === StatusFormat.FULLFILLMENT ||
                        orderItem.status === StatusFormat.RECEIVED
                          ? "bg-[#adfa1d]"
                          : "bg-red-400"
                      } rounded-s-none border border-l hover:${
                        orderItem.status === StatusFormat.FULLFILLMENT ||
                        orderItem.status === StatusFormat.RECEIVED
                          ? "bg-[#adfa1d]"
                          : "bg-red-400"
                      }  ${
                        orderItem.status === StatusFormat.FULLFILLMENT ||
                        orderItem.status === StatusFormat.RECEIVED
                          ? "text-black"
                          : ""
                      }`}
                    >
                      {orderItem.status === StatusFormat.FULLFILLMENT
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
                  {moment(orderItem.createdAt).format("MMM DD, YYYY hh:mm a")}
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
                {/* <Button
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
                            </Button> */}
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
        columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
        data={dataQuery.data?.data ?? defaultData}
        pagination={pagination}
        pageCount={dataQuery.data?.total_page ?? -1}
        onRowClick={(data) => router.push(`orders/${data.order_id}`)}
        responsive={true}
      />
      <DialogDelete
        deleteHandler={() => console.log(idToUpdate)}
        isLoading={false}
        isSuccess={false}
        openDialog={openDialog}
        openDialogHandler={openDialogHandlerParam}
      />
    </Layout>
  );
}
