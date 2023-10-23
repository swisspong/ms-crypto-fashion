import DialogDelete from "@/components/DialogDelete";
import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import FilterSearchState from "@/components/filterState";
import { columns } from "@/components/products/column";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useRemoveProduct } from "@/src/hooks/product/mutaions";
import { useProductAll } from "@/src/hooks/product/queries";
import { PaginationState } from "@tanstack/react-table";
import { data } from "autoprefixer";
import { useMemo, useState } from "react";

export default function Product() {

    const [search, setSerarch] = useState<string>();
    const [idToUpdate, setIdToUpdate] = useState<string>();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const {mutate: deleteHandler, isLoading: deleteLoading, isSuccess: deleteSuccess} = useRemoveProduct()

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

    const dataQuery = useProductAll({
        page: pageIndex,
        per_page: pageSize,
        search
    })

    

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
                    <FilterSearchState
                        search={search}
                        setSerarch={setSerarch}
                    />
                </div>
            </div>

            <DataTable
                title="สินค้าทั้งหมด"
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