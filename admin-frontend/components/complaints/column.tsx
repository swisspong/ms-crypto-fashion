
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
            cell: ({ row }) => (
                <Badge variant={row.original.type.toLocaleUpperCase() === "MERCHANT" ? "secondary" : "zinc"}>{row.original.type}</Badge>
            )
        },
        {
            accessorKey: "status",
            header: () => <div>#สถานะ</div>,
            cell: ({ row }) => (
                <Badge variant={row.original.status.toLocaleUpperCase() === "PENDING" ? "destructive" : row.original.status.toLocaleUpperCase() === "PROGRESS" ? "sky" : "green"}>{row.original.status}</Badge>
            )
        },
        {
            id: "action",
            cell: ({ row }) => {
                const status = Object.values(ComplaintFormat)
                const com = ComplaintFormat
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
                                    variant="secondary">{(val == com.PENDING? "รอดำเนินการ": val == com.PROGRESS? "กำลังดำเนินการ": val == com.RESOLVED? "แก้ไขเรียบร้อย": "ปิด")}</Button>
                            ))}
                        </Card>
                    </div>

                )
            }
        }
    ]

    return columns
}
