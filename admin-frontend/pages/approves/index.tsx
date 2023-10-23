import Layout from "@/components/Layout";
import { columns } from "@/components/approves/column";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useApprovesMerchant } from "@/src/hooks/merchant/mutaions";
import { useGetAllMerchantApproves } from "@/src/hooks/merchant/queries";
import { MerchantFormat } from "@/src/types/enums/merchant";
import { PaginationState } from "@tanstack/react-table";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function Approve() {
    // TODO: DataTable

    const { mutate, isLoading, isSuccess } = useApprovesMerchant()


    const setStatusHandler = (id: string | undefined, status: string) => {
        mutate({ id, status })
    };

    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    };


    const dataQuery = useGetAllMerchantApproves(fetchDataOptions)



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
                คำขอเปิดร้านค้าทั้งหมด
            </h3>
            <Card className="md:hidden mb-3">

                <CardContent className="grid gap-6 pt-5">
                    {((dataQuery.data?.data.length ?? 0) <= 0) && (
                        <div className="text-center">ไม่มีข้อมูล</div>
                    )}
                    {dataQuery.data?.data.map((data) => {
                        return (
                            <div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <div className="overflow-hidden rounded-md">

                                            <Dialog>
                                                <DialogTrigger>
                                                    <img
                                                        src={data.id_card_img}
                                                        alt={data.name}
                                                        // width={width}
                                                        // height={height}
                                                        className={
                                                            "h-auto w-auto object-cover transition-all hover:scale-105 aspect-square"}
                                                    />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader className="p-4">
                                                        <img
                                                            src={
                                                                data.id_card_img
                                                            }
                                                        />
                                                    </DialogHeader>
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                    </div>

                                    <div className="">
                                        <Label>{data.name}</Label>
                                        <br />
                                        <Label className="text-muted-foreground">{data.banner_title}</Label>
                                        <br />
                                        <Label>ชื่อ-นามสกุล: </Label>
                                        <br />
                                        <Label>{data.first_name}{" "}{data.last_name}</Label>
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-4">
                                    <div className="">
                                        <Button variant="green"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setStatusHandler(data.mcht_id as string, MerchantFormat.APPROVED);
                                            }}
                                        >อนุมัติ</Button>
                                    </div>
                                    <Button variant="destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStatusHandler(data.mcht_id as string, MerchantFormat.DISAPPROVAL);
                                        }}
                                    >ปฏิเสธ</Button>
                                </div>
                            </div>
                        )
                    })}
                    {/* <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        
                    </div> */}
                </CardContent>
            </Card>
            <DataTable
                title="คำขอเปิดร้านค้าทั้งหมด"
                setPagination={setPagination}
                columns={columns({ setStatusHandler })}
                data={dataQuery.data?.data ?? defaultData}
                pagination={pagination}
                pageCount={dataQuery.data?.total_page ?? -1}
                responsive={true}
            />
        </Layout>
    )
}
export const getServerSideProps = withUser();