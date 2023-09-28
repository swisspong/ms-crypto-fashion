"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button";
import { headers } from "next/dist/client/components/headers";

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
  const columns: ColumnDef<TComment>[] = [
    {
      accessorKey: "user",
      header: () => <div>#ผู้แสดงความคิดเห็น</div>,
      cell: ({ row }) => (
        <div>{row.original.user.username}</div>
      )
    },
    {
      accessorKey: "product",
      header: () => <div>#ชื่อสินค้า</div>,
      cell: ({ row }) => (
        <div>{row.original.product.name}</div>
      )
    },
    {
      accessorKey: 'rating',
      header: () => <div>#การให้คะแนน</div>
    },
    {
      accessorKey: "text",
      header: () => <div>#ความคิดเห็น</div>
    },
    {
      accessorKey: "delete",
      header: () => "",
      cell: ({ row }) => (
        <Button variant="destructive" onClick={(e) => {
          e.stopPropagation();
          setIdHandler(row.original.comment_id as string);
          openDialogHandler();
        }}
        >ลบ</Button>
      )
    }
  ]

  return columns
}
