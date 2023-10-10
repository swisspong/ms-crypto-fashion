"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { headers } from "next/dist/client/components/headers";
import { Badge } from "../ui/badge";
import { MerchantFormat } from "@/src/types/enums/merchant";

interface columnProps {
  setIdHandler: (id: string | undefined) => void;
  openSheetHandler: () => void;
  openDialogHandler: () => void;
}
export const columns = ({
  setIdHandler,
  openSheetHandler,
  openDialogHandler,
}: columnProps) => {
  const router = useRouter();
  const columns: ColumnDef<IMerchant>[] = [
    {
      accessorKey: "image_url",
      header: () => <div>#ร้านค้า</div>,
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <img src={row.original.banner_url ??
            "https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"} className="object-cover h-14 w-14 rounded-md" alt="img_merchant" />
          <div>{row.original.name}</div>
        </div>
      )
    },
    {
      accessorKey: "banner_title",
      header: () => <div>#แบนเนอร์</div>
    },
    {
      accessorKey: "status",
      header: () => <div>#สถานะ</div>,
      cell: ({ row }) => {
        
        const status = row.original.status
        return (
          <Badge variant="secondary">
            {status === MerchantFormat.DISAPPROVAL ? "ไม่อนุมัติ":
            status === MerchantFormat.APPROVED? "อนุมัติ": 
            status === MerchantFormat.IN_PROGRESS? "กำลังรอการอนุมัติ":
            status === MerchantFormat.OPENED? "เปิดร้านค้า" : "ปิด"
            }
          </Badge>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">เปิดเมนู</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>การกระทำ</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(row.original.mcht_id.toString());
                  }}
                >
                  คัดลอกไอดี
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <Link href={`merchants/edit/${row.original.mcht_id}`} passHref>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    แก้ไข
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdHandler(row.original.mcht_id as string);
                    openDialogHandler();
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  ลบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return columns;
};
