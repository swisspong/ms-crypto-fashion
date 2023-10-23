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
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { showPrice, showStock } from "./products-helper";

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
  const columns: ColumnDef<IProductRow>[] = [
    {
      accessorKey: "image",
      header: () => <div>สินค้า</div>,
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.original.image_urls[0]}
            className="object-cover h-14 w-14 rounded-md"
          />
          <div>{row.original.name}</div>
        </div>
      ),
    },
    {
      id: "stock",
      // accessorKey: "stock",
      header: () => <div>จำนวนที่เหลืออยู่</div>,
      cell: ({ row }) => {
        return (
          <div>
            {row.original.variants.length > 1
              ? showStock(row.original.variants).map((val, index) => (
                  <>
                    {index === 1 ? " ~ " : undefined} {val}
                  </>
                ))
              : row.original.variants.length > 0
              ? row.original.variants[0].stock
              : row.original.stock}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "order",
    //   header: () => <div>ORDERS</div>,
    // },
    {
      id: "price",
      // accessorKey: "price",
      header: () => <div>ราคา</div>,
      cell: ({ row }) => {
        showPrice(row.original.variants);
        return (
          <div>
            {row.original.variants.length > 1
              ? showPrice(row.original.variants).map((val, index) => (
                  <>
                    {index === 1 ? " ~ " : undefined} ฿{val?.toFixed(2)}
                    {/* <Currency value={val} /> */}
                  </>
                ))
              : row.original.variants.length > 0
              ? "฿" + row.original.variants[0].price.toFixed(2)
              : "฿" + row.original.price.toFixed(2)}
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
                      row.original.prod_id.toString()
                    );
                  }}
                >
                  คัดลอกไอดี
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <Link href={`products/${row.original.prod_id}`} passHref>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    แก้ไข
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdHandler(row.original.prod_id as string);
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
