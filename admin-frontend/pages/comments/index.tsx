import DialogDelete from "@/components/DialogDelete";
import Layout from "@/components/Layout";
import { columns } from "@/components/comments/column";
import { DataTable } from "@/components/data-table";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useDeleteComment } from "@/src/hooks/comment/mutaions";
import { useAllComments } from "@/src/hooks/comment/queries";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export default function Comment() {

    const [idToUpdate, setIdToUpdate] = useState<string>();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const {mutate: deleteHandler, isLoading: deleteLoading, isSuccess: deleteSuccess} = useDeleteComment()

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


    const dataQuery = useAllComments(fetchDataOptions)
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
            <DataTable
                title="All Comment"
                setPagination={setPagination}
                columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
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