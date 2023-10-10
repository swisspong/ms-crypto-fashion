
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ComplaintFormat } from "@/src/types/enums/complaint";

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
            header: () => <div>#รายละเอียด</div>
        },
        {
            accessorKey: "type",
            header: () => <div>#ประเภทคำร้อง</div>,
            cell: ({ row }) => {
                const type = row.original.type
                return (
                    <Badge variant={row.original.type.toLocaleUpperCase() === "MERCHANT" ? "secondary" : "zinc"}>{type === "MERCHANT" ? "ร้านค้า" : "สินค้า"}</Badge>
                )
            }
        },
        {
            accessorKey: "status",
            header: () => <div>#สถานะ</div>,
            cell: ({ row }) => {
                const com = ComplaintFormat
                const status = row.original.status.toLocaleUpperCase()
                return (
                    <Badge variant={row.original.status.toLocaleUpperCase() === "PENDING" ? "destructive" : row.original.status.toLocaleUpperCase() === "PROGRESS" ? "sky" : "green"}>
                        {status === ComplaintFormat.PENDING.toLocaleUpperCase() ? "รอดำเนินการ":
                         status === ComplaintFormat.PROGRESS.toLocaleUpperCase()? "กำลังดำเนินการ":
                         status === ComplaintFormat.RESOLVED.toLocaleUpperCase()? "แก้ไขเรียบร้อย": "ปิด"
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
                    <div className="w-full flex flex-wrap justify-end" >
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
