import Layout from "@/components/Layout";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table"
import { PaginationState } from "@tanstack/react-table";
import { columns } from "@/components/admins/column";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import DialogDelete from "@/components/DialogDelete";
import { useGetAllAdmin } from "@/src/hooks/admin/queries";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useDeleteAdmin } from "@/src/hooks/admin/mutaions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


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
                            {`เพิ่มแอดมิน`}
                        </Button>
                    </Link>


                </div>
            </div>
            <h3 className="text-lg font-semibold leading-none tracking-tight mb-4 block md:hidden">
                แอดมิน (ผู้ดูแล) ทั้งหมด
            </h3>
            <Card className="md:hidden mb-3">
                <CardContent className="grid gap-6 pt-5">
                    {((dataQuery.data?.data.length ?? 0) <= 0) && (
                        <div className="text-center">ไม่มีข้อมูล</div>
                    )}
                    {
                        dataQuery.data?.data.map((data) => (
                            <div key={data.id} className="flex items-center justify-between space-x-4 pb-3 border-b">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <p className="text-sm font-medium leading-none">{data.username}</p>
                                        <p className="text-sm text-muted-foreground">{data.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button className="mr-3" variant="outline">ดูสิทธิ์</Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        {data.permission.length > 0 ? data.permission.map((val, index) => (
                                                            <Badge key={val} className="m-1" variant="secondary">{val}</Badge>
                                                        )) : (<div className="ml-3">ไม่มีสิทธิ์</div>)}
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="grid grid-cols-3 items-center gap-4">

                                                        </div>

                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">เปิดเมนู</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent >
                                                <DropdownMenuLabel>การกระทำ</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigator.clipboard.writeText(
                                                            data.user_id.toString()
                                                        );
                                                    }}
                                                >
                                                    คัดลอกไอดี
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />

                                                <Link href={`admins/edit/${data.user_id}`} passHref>
                                                    <DropdownMenuItem>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        แก้ไข
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIdHandler(data.user_id as string);
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
                            </div>
                        ))
                    }

                </CardContent>
            </Card>
            <DataTable
                title="แอดมิน (ผู้ดูแล) ทั้งหมด"
                setPagination={setPagination}
                columns={columns({ openSheetHandler, setIdHandler, openDialogHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
                onRowClick={(data) => {
                    router.push(`admins/edit/${data.user_id}`);
                }}
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