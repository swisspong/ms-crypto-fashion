import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import DialogDelete from "@/components/dialog-delete";
import { columns } from "@/components/products/column";
import { showPrice, showStock } from "@/components/products/products-helper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveProduct } from "@/src/hooks/product/mutations";
import { useProducts } from "@/src/hooks/product/queries";
import { PaginationState } from "@tanstack/react-table";
import { Edit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Role() {
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
  const { data } = useProducts({ page: pageIndex + 1, per_page: pageSize });

  const { mutate, isLoading, isSuccess } = useRemoveProduct();
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
      <div className="space-between flex items-center mb-4">
        <div className="ml-auto">
          <Link href={"products/add"} passHref>
            <Button size={"lg"}>
              <PlusCircle className="mr-2 h-4 w-4" />
              เพิ่มสินค้า
            </Button>
          </Link>
        </div>
      </div>
      <h3 className="text-lg font-semibold leading-none tracking-tight mb-4 block md:hidden">
        สินค้าทั้งหมด
      </h3>
      <div className="space-y-2 pb-2">
        {data?.data.map((data) => (
          <div className="px-2 mb-1 block md:hidden ">
            <div className="flex items-center space-x-3">
              <img
                src={data.image_urls[0]}
                className="object-cover h-14 w-14 rounded-md"
              />
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <p className="line-clamp-1 text-sm mb-1">{data.name}</p>
                  <div className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">เปิดเมนู</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>การกระทำ</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              data.prod_id.toString()
                            );
                          }}
                        >
                          คัดลอกไอดี
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <Link href={`products/${data.prod_id}`} passHref>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            แก้ไข
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setIdHandler(data.prod_id as string);
                            openDialogHandler();
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex justify-between pb-1 border-b text-muted-foreground">
                  <p className="text-xs">
                    จำนวน{" "}
                    {data.variants.length > 1
                      ? showStock(data.variants).map((val, index) => (
                          <>
                            {index === 1 ? " ~ " : undefined} {val}
                          </>
                        ))
                      : data.variants.length > 0
                      ? data.variants[0].stock
                      : data.stock}
                  </p>
                  <p className="text-xs">
                    ราคา{" "}
                    {data.variants.length > 1
                      ? showPrice(data.variants).map((val, index) => (
                          <>
                            {index === 1 ? " ~ " : undefined} ฿{val?.toFixed(2)}
                            {/* <Currency value={val} /> */}
                          </>
                        ))
                      : data.variants.length > 0
                      ? "฿" + data.variants[0].price.toFixed(2)
                      : "฿" + data.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {data?.data && data?.data.length <= 0 ? (
          <div className="px-2 mb-1 block md:hidden ">
            <div className="flex items-center justify-center space-x-3 w-full border-y h-10">
              <p>ไม่มีข้อมูล</p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* <Separator className="my-4" /> */}
      <DataTable
        title="สินค้าทั้งหมด"
        setPagination={setPagination}
        columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
        //data={dataQuery.data?.data ?? defaultData}
        data={data?.data ?? defaultData}
        pagination={pagination}
        // pageCount={dataQuery.data?.total_page ?? -1}
        pageCount={data?.total_page ?? -1}
        onRowClick={(data) => {
          router.push(`products/${data.prod_id}`);
        }}
        responsive={true}
      />
      <DialogDelete
        deleteHandler={() => mutate(idToUpdate as string)}
        isLoading={isLoading}
        isSuccess={isSuccess}
        openDialog={openDialog}
        openDialogHandler={openDialogHandlerParam}
      />
    </Layout>
  );
}
