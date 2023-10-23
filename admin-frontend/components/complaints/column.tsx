
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ComplaintFormat } from "@/src/types/enums/complaint";
import Link from "next/link";

interface columnProps {
    setHandler: (status: string | undefined, id: string | undefined) => void;
    openSheetHandler: () => void;
    openDialogHandler: () => void;
}
export const columns = ({
    setHandler,
    openSheetHandler,
    openDialogHandler,
}: columnProps) => {
    const columns: ColumnDef<IComplaint>[] = [

        {
            accessorKey: "detail",
            header: () => <div>#รายละเอียด</div>,
            cell: ({row}) => {
                return (
                    <div className="w-40 sm:w-48">
                        {row.original.detail}
                    </div>
                )
            }
        },
        {
            accessorKey: "type",
            header: () => <div>#ประเภทคำร้อง</div>,
            cell: ({ row }) => {
                const type = row.original.type.toLocaleUpperCase()
                return (
                    <Badge
                        className="w-20 justify-center text-center sm:w-24"
                        variant={row.original.type.toLocaleUpperCase() === "MERCHANT" ? "secondary" : "zinc"}>{type === "MERCHANT" ? "ร้านค้า" : "สินค้า"}</Badge>
                )
            }
        },
        {
            accessorKey: "prod_id",
            header: () => <div>#ดูสินค้าหรือร้านค้า</div>,
            cell: ({ row }) => {
                const type = row.original.type.toLocaleUpperCase()
                const prod = row.original.prod_id
                const mcht = row.original.mcht_id


                if (type === "MERCHANT") {
                    if (mcht) {
                        return (
                            <Link href={`${process.env.HOST_CUSTOMER}/merchants/${mcht}`}>
                                <Button onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                    className="w-32 justify-center text-center sm:w-36"
                                    variant="secondary">
                                    รายละเอียดร้าน
                                </Button>
                            </Link>
                        )
                    } else {
                        return (
                            <Button
                                disabled={true}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                variant="secondary">
                                ไม่มีร้านค้านี้อยู่แล้ว
                            </Button>
                        )
                    }

                } else {
                    if (prod) {
                        return (
                            <Link href={`${process.env.HOST_CUSTOMER}/merchants/${mcht}/product/${prod}`}>
                                <Button onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                    className="w-32 justify-center text-center sm:w-36"
                                    variant="secondary">
                                    รายละเอียดสินค้า
                                </Button>
                            </Link>
                        )
                    } else {
                        return (
                            <Button
                                disabled={true}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                variant="secondary">
                                ไม่มีสินค้านี้อยู่แล้ว
                            </Button>
                        )
                    }
                }
            }
        },
        {
            accessorKey: "status",
            header: () => <div>#สถานะ</div>,
            cell: ({ row }) => {
                const com = ComplaintFormat
                const status = row.original.status.toLocaleUpperCase()
                return (
                    <Badge
                        className="w-20 justify-center text-center sm:w-28"
                        variant={row.original.status.toLocaleUpperCase() === "PENDING" ? "destructive" : row.original.status.toLocaleUpperCase() === "PROGRESS" ? "sky" : "green"}>
                        {status === ComplaintFormat.PENDING.toLocaleUpperCase() ? "รอดำเนินการ" :
                            status === ComplaintFormat.PROGRESS.toLocaleUpperCase() ? "กำลังดำเนินการ" :
                                status === ComplaintFormat.RESOLVED.toLocaleUpperCase() ? "แก้ไขเรียบร้อย" : "ปิด"
                        }
                    </Badge>
                )
            }
        },
        {
            id: "action",
            cell: ({ row }) => {
                const status = Object.values(ComplaintFormat)
                const com = ComplaintFormat
                const statusCurrent = row.original.status.toLocaleUpperCase()

                return (
                    <div className="w-36 md:w-full flex flex-wrap justify-end" >
                        <Card className="pt-1 pb-1  text-center ">
                            {status.map((val) => (
                                <Button onClick={(e) => {
                                    e.stopPropagation()
                                    setHandler(val, row.original.comp_id)
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

                )
            }
        }
    ]

    return columns
}
