import DialogDelete from "@/components/DialogDelete";
import Layout from "@/components/Layout";
import { columns } from "@/components/comments/column";
import { DataTable } from "@/components/data-table";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useDeleteComment } from "@/src/hooks/comment/mutaions";
import { useAllComments } from "@/src/hooks/comment/queries";
import { PaginationState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Comment() {

    const [idToUpdate, setIdToUpdate] = useState<string>();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const { mutate: deleteHandler, isLoading: deleteLoading, isSuccess: deleteSuccess } = useDeleteComment()

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
            <h3 className="text-lg font-semibold leading-none tracking-tight mb-4 block md:hidden">
                ความคิดเห็นทั้งหมด
            </h3>
            <Card className="md:hidden mb-3">

                <CardContent className="grid gap-6 pt-5">
                    {((dataQuery.data?.data.length ?? 0) <= 0) && (
                        <div className="text-center">ไม่มีข้อมูล</div>
                    )}
                    {dataQuery.data?.data.map((data) => {
                        return (
                            <div key={data.comment_id} className="border-b pb-3">
                                <div className="flex  items-center justify-between space-x-2">
                                    <Label htmlFor="necessary" className="flex flex-col space-y-1">
                                        <span>{data.user_name}</span>
                                        <span className="font-normal leading-snug text-muted-foreground">
                                            {data.text}
                                        </span>
                                    </Label>

                                </div>
                                <div className="flex  items-center justify-between space-x-2">
                                    <div>
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                disabled={true}
                                                className={`text-1xl focus:outline-none ${value <= data.rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <div>ชื่อสินค้า: {data.product.name}</div>
                                </div>
                                <Button className="w-full mt-2" variant="destructive" onClick={(e) => {
                                    e.stopPropagation();
                                    setIdHandler(data.comment_id as string);
                                    openDialogHandler();
                                }}
                                >ลบ</Button>
                            </div>

                        )
                    })}

                </CardContent>
            </Card>
            <DataTable
                title="ความคิดเห็นทั้งหมด"
                setPagination={setPagination}
                columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
                responsive={true}
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