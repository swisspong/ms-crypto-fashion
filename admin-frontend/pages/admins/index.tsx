import Layout from "@/components/Layout";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table"
import { PaginationState } from "@tanstack/react-table";
import { columns } from "@/components/admins/column";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import DialogDelete from "@/components/DialogDelete";
import { useGetAllAdmin } from "@/src/hooks/admin/queries";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useDeleteAdmin } from "@/src/hooks/admin/mutaions";

export default function Admin() {

    const router = useRouter()
    const {
        mutate: deleteHandler,
        isSuccess: deleteSuccess,
        isLoading: deleteLoading,
    } = useDeleteAdmin();

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

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    };


    const dataQuery = useGetAllAdmin(fetchDataOptions)
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
            <div className="space-between flex items-center mb-5">

                <div className="ml-auto">
                    <Link href="/admins/add">
                        <Button size={"lg"}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {`Add`}
                        </Button>
                    </Link>


                </div>
            </div>
            <DataTable
                title="All Admin"
                setPagination={setPagination}
                columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
                onRowClick={(data) => {
                    router.push(`admins/edit/${data.user_id}`);
                }}
            />
            <DialogDelete
                deleteHandler={() => deleteHandler(idToUpdate!)}
                isLoading={deleteLoading}
                isSuccess={deleteSuccess}
                openDialog={openDialog}
                openDialogHandler={openDialogHandlerParam}
            />
        </Layout>
    )
}

export const getServerSideProps = withUser();