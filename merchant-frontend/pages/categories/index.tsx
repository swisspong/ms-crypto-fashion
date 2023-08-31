import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/categories/column";
// import RoleForm from "@/components/roles/role-form";
import { Separator } from "@/components/ui/separator";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import DialogDelete from "@/components/dialog-delete";
import { useCategories } from "@/src/hooks/category/queries";
import { withUser } from "@/src/hooks/user/auth/auth-hook";
import { useRemoveCategory } from "@/src/hooks/category/mutations";
import { RoleFormat } from "@/src/types/user";

export default function Categories() {
  const router = useRouter();
  // TODO: Set column in DataTable
  const [idToUpdate, setIdToUpdate] = useState<string>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { mutate, isLoading, isSuccess } = useRemoveCategory();
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

  const setIdHandler = (id: string | undefined) => {
    setIdToUpdate(id);
  };
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data } = useCategories({ page: pageIndex + 1, per_page: pageSize });

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
          <Link href={"categories/add"} passHref>
            <Button size={"lg"}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {`Add Category`}
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        title="Categories"
        setPagination={setPagination}
        columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
        data={data?.data ?? defaultData}
        pagination={pagination}
        pageCount={data?.total_page ?? -1}
        onRowClick={(data) => {
          router.push(`categories/${data.cat_id}`);
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

export const getServerSideProps = withUser([RoleFormat.MERCHANT]);
