"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

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
  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "image_urls",
      header: () => <div>#สินค้า</div>,
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
      accessorKey: "merchant",
      header: () => <div>#ร้านค้า</div>,
      cell: ({ row }) => (
        <div>{row.original.merchant.name}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-right">

            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIdHandler(row.original.prod_id as string);
                openDialogHandler();
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ลบ
            </Button>
          </div>
        );
      },
    }
  ]

  return columns
}
