import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/orders/column";
import { Button } from "@/components/ui/button";
// import RoleForm from "@/components/roles/role-form";
import { Separator } from "@/components/ui/separator";
import { PaginationState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function AddRole() {
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

  const dataQuery: { data: { data: IOrderRow[]; total_page: number } } = {
    data: {
      data: [
        {
          id: "cat_1",
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
          amount: 20,
          created_at: "2023-06-15T08:39:59.434Z",
          email: "swiss@gmail.com",
          status: "NOT PAID",
        },
      ],
      total_page: 1,
    },
  };
  const defaultData = useMemo(() => [], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  return (
    <Layout>
      <div className="space-between flex items-center mb-4">
        <div className="ml-auto">
          <Link href={"orders/add"} passHref>
            <Button size={"lg"}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {`Add Order`}
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        title="Orders"
        setPagination={setPagination}
        columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
        data={dataQuery.data?.data ?? defaultData}
        pagination={pagination}
        pageCount={dataQuery.data?.total_page ?? - 1}
      />
    </Layout>
  );
}
