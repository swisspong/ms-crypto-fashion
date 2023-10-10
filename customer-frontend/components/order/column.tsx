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
import { ReviewFormat } from "@/src/types/enums/review";

interface columnProps {
  setIdHandler: (id: string | undefined) => void;
  openSheetHandler: () => void;
  openDialogHandler: () => void;
  setDataItems: (body: Item[]) => void;
}
export const columns = ({
  setIdHandler,
  openSheetHandler,
  openDialogHandler,
  setDataItems,
}: columnProps) => {
  const router = useRouter();
  const columns: ColumnDef<IOrderRow>[] = [
    {
      accessorKey: "image",
      header: () => <div>คำสั่งซื้อ</div>,
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
            } rounded-e-none border border-r  ${row.original.payment_status === PaymentFormat.PAID?"text-black":"text-white"} hover:${
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
            }  ${
              row.original.status === StatusFormat.FULLFILLMENT ||
              row.original.status === StatusFormat.RECEIVED
                ? "text-black"
                : ""
            }`}
          >
            {row.original.status.toUpperCase()}
          </Badge>
          {/* <div className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">

            PAID
          </div> */}
          {/* <div>{moment(row.original.created_at).format("hh:mm a")}</div> */}
        </div>
      ),
    },

    {
      accessorKey: "amount",
      header: () => <div>ยอดชำระ</div>,
      cell: ({ row }) => <div>${row.original.total.toFixed(2)}</div>,
    },
    {
      id: "comment",
      cell: ({ row }) => {
        return (
          <div className="text-reght">
            {row.original.reviewStatus !== ReviewFormat.REVIEWED ? (
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  const items = row.original.items;
                  const seenIds = new Set();
                  const data: Item[] = [];
                  const filteredItems = await items.filter((item) => {
                    if (seenIds.has(item.prod_id)) {
                      return false; // ไม่รวม item ที่ซ้ำกันในผลลัพธ์
                    }
                    seenIds.add(item.prod_id);
                    data.push(item);
                    return true;
                  });

                  // console.log(filteredItems)

                  await setDataItems(data );
                  setIdHandler(row.original.order_id as string);
                  openSheetHandler();
                }}
                variant="default"
                key={row.original.order_id}
              >
                แสดงความคิดเห็น
              </Button>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      row.original.order_id.toString()
                    );
                  }}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <Link href={`orders/${row.original.order_id}`} passHref>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
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
                  Delete
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
