"use client";

import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
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
import { Badge } from "../ui/badge";
import { PaymentFormat, StatusFormat } from "@/src/types/enums/order";

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
  const columns: ColumnDef<IOrderRow>[] = [
    {
      accessorKey: "image",
      header: () => <div>รายการคำสั่งซื้อ</div>,
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.original.items[0].image}
            className="object-cover h-14 w-14 rounded-md"
          />
          <div>{row.original.recipient}</div>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => <div>วัน/เวลา</div>,
      cell: ({ row }) => (
        <div>
          <div>{moment(row.original.createdAt).format("MMM DD, YYYY")}</div>
          <div>{moment(row.original.createdAt).format("hh:mm a")}</div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div>สถานะ</div>,
      cell: ({ row }) => (
        <div className="flex justify-start items-center">
          <Badge
            className={`${
              row.original.payment_status === PaymentFormat.PAID
                ? "bg-[#adfa1d]"
                : "bg-red-400"
            } rounded-e-none border border-r text-black hover:${
              row.original.payment_status === PaymentFormat.PAID
                ? "bg-[#adfa1d]"
                : "bg-red-400"
            }`}
          >
            {row.original.payment_status.toUpperCase()}
          </Badge>
          <Badge
            className={`${
              row.original.status === StatusFormat.FULLFILLMENT ||
              row.original.status === StatusFormat.RECEIVED
                ? "bg-[#adfa1d]"
                : "bg-red-400"
            } rounded-s-none border border-l hover:${
              row.original.status === StatusFormat.FULLFILLMENT ||
              row.original.status === StatusFormat.RECEIVED
                ? "bg-[#adfa1d]"
                : "bg-red-400"
            } ${
              row.original.status === StatusFormat.FULLFILLMENT ||
              row.original.status === StatusFormat.RECEIVED
                ? "text-black"
                : ""
            }`}
          >
            {row.original.status.toUpperCase()}
          </Badge>
          {/* <div>{moment(row.original.created_at).format("hh:mm a")}</div> */}
        </div>
      ),
    },

    {
      accessorKey: "amount",
      header: () => <div>ยอดชำระ</div>,
      cell: ({ row }) => <div>฿{row.original.total.toFixed(2)}</div>,
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
                    navigator.clipboard.writeText(
                      row.original.order_id.toString()
                    );
                  }}
                >
                  คัดลอกไอดี
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <Link href={`orders/edit/${row.original.order_id}`} passHref>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    แก้ไข
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdHandler(row.original.order_id as string);
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
