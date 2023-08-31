import DialogDelete from "@/components/DialogDelete";
import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/merchants/column";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useDeleteMerchant } from "@/src/hooks/merchant/mutaions";
import { useGetAllMerchant } from "@/src/hooks/merchant/queries";
import { PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import * as z from "zod"
export default function Merchant() {
    const router = useRouter()
    // TODO: DataTable
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
    

    const dataQuery = useGetAllMerchant(fetchDataOptions)
    console.log(dataQuery.data)
    const defaultData = useMemo(() => [], []);
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    // !!! END DataTable

    const {mutate: deleteHandler, isLoading: deleteLoading, isSuccess: deleteSuccess} = useDeleteMerchant()


    return (
        <Layout>
            <DataTable
                title="All merchants"
                setPagination={setPagination}
                columns={columns({ openDialogHandler, setIdHandler, openSheetHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
                onRowClick={(data) => router.push(`merchants/edit/${data.mcht_id}`)}
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