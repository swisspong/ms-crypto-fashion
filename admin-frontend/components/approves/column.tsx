import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import { Badge } from "../ui/badge";
import { MerchantFormat } from "@/src/types/enums/merchant";

interface columnProps {
  setStatusHandler: (id: string | undefined, status: string) => void;
}
export const columns = ({
  setStatusHandler
}: columnProps) => {
  const columns: ColumnDef<IMerchant>[] = [
    {
      accessorKey: "name",
      header: () => <div>#ร้านค้า</div>
    },
    {
      accessorKey: "banner_title",
      header: () => <div>#แบนเนอร์</div>,
    },
    {
      accessorKey: "id_card_img",
      header: () => <div>#รูปบัตรประจำตัวประชาชน</div>,
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Dialog>
            <DialogTrigger><img
              src={
                row.original.id_card_img
              }
              className="object-cover h-20 w-40 rounded-md"
            /></DialogTrigger>
            <DialogContent>
              <DialogHeader className="p-4">
                <img
                  src={
                    row.original.id_card_img
                  }
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

      ),
    },
    {
      accessorKey: "first_name",
      header: () => <div>#ชื่อ</div>,
    },
    {
      accessorKey: "last_name",
      header: () => <div>#นามสกุล</div>,
    },
    {
      id: "approved",
      cell: ({ row }) => (
        <div className="text-right">
          <Button variant="green"
            onClick={(e) => {
              e.stopPropagation();
              setStatusHandler(row.original.mcht_id as string,MerchantFormat.APPROVED);
            }}
          >อนุมัติ</Button>
        </div>
      )
    },
    {
      id: "disapproval",
      cell: ({ row }) => (
        <Button variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            setStatusHandler(row.original.mcht_id as string,MerchantFormat.DISAPPROVAL);
          }}
        >ปฏิเสธ</Button>
      )
    }
  ]

  return columns
}
