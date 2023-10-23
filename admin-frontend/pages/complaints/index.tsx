import DialogAlert from "@/components/DialogAlert";
import Layout from "@/components/Layout";
import { columns } from "@/components/complaints/column";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useUpdateComplaint } from "@/src/hooks/complaint/mutaions";
import { useGetAllComplaints } from "@/src/hooks/complaint/querires";
import { ComplaintFormat } from "@/src/types/enums/complaint";
import { PaginationState } from "@tanstack/react-table";
import Link from "next/link";

import { useMemo, useState } from "react";

export default function Complaint() {

    // TODO: Set column in DataTable
    const [idToUpdate, setIdToUpdate] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const { mutate: updateHandler, isLoading, isSuccess } = useUpdateComplaint()

    const openDialogHandlerParam = (open: boolean) => {
        if (!open) {
            setHandler(undefined, undefined);
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
            setHandler(undefined, undefined);
        }
        setOpen(con);
    };

    const setHandler = (status: string | undefined, id: string | undefined) => {
        setStatus(status);
        setIdToUpdate(id)
    };


    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    };

    const dataQuery = useGetAllComplaints(fetchDataOptions)
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
                รายการคำร้องทั้งหมด
            </h3>

            <Card className="md:hidden mb-3 ">
                <CardContent className="grid gap-6 pt-5">

                    {((dataQuery.data?.data.length ?? 0) <= 0) && (
                        <div className="text-center">ไม่มีข้อมูล</div>
                    )}
                    {dataQuery.data?.data.map((data) => {
                        const type = data.type.toLocaleUpperCase()
                        const prod = data.prod_id
                        const mcht = data.mcht_id
                        const status = data.status.toLocaleUpperCase()

                        const status_format = Object.values(ComplaintFormat)
                        const com = ComplaintFormat
                        const statusCurrent = status

                        return (

                            <div key={data.comp_id} className="border-b pb-3">
                                <Label htmlFor="functional" className="mb-1 flex flex-col space-y-1">
                                    <span>#รายละเอียด</span>

                                </Label>
                                <div className="flex  items-center justify-between space-x-2">
                                    <Label htmlFor="necessary" className="flex flex-col space-y-1">
                                        <span className="font-normal w-48  leading-snug text-muted-foreground">
                                            {data.detail}
                                        </span>
                                    </Label>

                                    <Badge
                                        className="w-20 justify-center text-center "
                                        variant={data.type.toLocaleUpperCase() === "MERCHANT" ? "secondary" : "zinc"}>{data.type.toLocaleUpperCase() === "MERCHANT" ? "ร้านค้า" : "สินค้า"}</Badge>
                                </div>
                                <div className="mt-3 flex  items-center justify-between space-x-2">
                                    {!(type === "MERCHANT") ? (
                                        <Link href={`${process.env.HOST_CUSTOMER}/merchants/${mcht}/product/${prod}`}>
                                            <Button onClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                                className="w-32 justify-center text-center sm:w-36"
                                                variant="secondary">
                                                ดูสินค้า
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href={`${process.env.HOST_CUSTOMER}/merchants/${mcht}`}>
                                            <Button onClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                                className="w-32 justify-center text-center sm:w-36"
                                                variant="secondary">
                                                ดูร้านค้า
                                            </Button>
                                        </Link>
                                    )

                                    }

                                    <Badge
                                        className="w-32 justify-center text-center sm:w-28"
                                        variant={status === "PENDING" ? "destructive" : status === "PROGRESS" ? "sky" : "green"}>
                                        {status === ComplaintFormat.PENDING.toLocaleUpperCase() ? "รอดำเนินการ" :
                                            status === ComplaintFormat.PROGRESS.toLocaleUpperCase() ? "กำลังดำเนินการ" :
                                                status === ComplaintFormat.RESOLVED.toLocaleUpperCase() ? "แก้ไขเรียบร้อย" : "ปิด"
                                        }
                                    </Badge>
                                </div>

                                <div className="mt-3 flex flex-wrap justify-end" >
                                    <Card className="pt-1 pb-1  text-center ">
                                        {status_format.map((val) => (
                                            <Button onClick={(e) => {
                                                e.stopPropagation()
                                                setHandler(val, data.comp_id)
                                                openDialogHandler();
                                            }}
                                                className="m-1"
                                                key={val}
                                                disabled={statusCurrent == val.toLocaleUpperCase()}
                                                variant="secondary">{(val == com.PENDING ? "รอดำเนินการ" : val == com.PROGRESS ? "กำลังดำเนินการ" : val == com.RESOLVED ? "แก้ไขเรียบร้อย" : "ปิด")}
                                            </Button>
                                        ))}
                                    </Card>
                                </div>
                            </div>


                        )
                    }
                    )
                    }

                </CardContent>

            </Card>
            <DataTable
                title="รายการคำร้องทั้งหมด"
                setPagination={setPagination}
                columns={columns({ openSheetHandler, setHandler, openDialogHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
                responsive={true}
            />
            <DialogAlert
                handler={() => updateHandler({ status: status!, id: idToUpdate! })}
                isLoading={isLoading}
                isSuccess={isSuccess}
                title_alert={status!}
                openDialog={openDialog}
                openDialogHandler={openDialogHandlerParam}
            />
        </Layout>
    )
}

export const getServerSideProps = withUser();