import DialogDelete from "@/components/DialogDelete";
import Layout from "@/components/Layout";
import { columns } from "@/components/categorys/column";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useDeleteCategory } from "@/src/hooks/category/mutaions";
import { useCategories } from "@/src/hooks/category/queries";
import { PaginationState } from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

export default function Category() {

    const router = useRouter();
    // TODO: Set column in DataTable
    const [idToUpdate, setIdToUpdate] = useState<string>();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const {mutate: deleteHandler, isLoading: deleteLoading, isSuccess: deleteSuccess} = useDeleteCategory()

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


    const dataQuery = useCategories(fetchDataOptions)
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
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
                onRowClick={(data) => {
                    router.push(`categories/edit/${data.catweb_id}`);
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

export const getServerSideProps = withUser()