import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import DialogDelete from "@/components/dialog-delete";
import { columns } from "@/components/products/column";
import { Button } from "@/components/ui/button";
import { useRemoveProduct } from "@/src/hooks/product/mutations";
import { useProducts } from "@/src/hooks/product/queries";
import { PaginationState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
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
