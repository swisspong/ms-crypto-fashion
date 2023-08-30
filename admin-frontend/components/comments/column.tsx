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
      header: () => <div>#USER NAME</div>,
      cell: ({ row }) => (
        <div>{row.original.user.username}</div>
      )
    },
    {
      accessorKey: "product",
      header: () => <div>#PRODUCT NAME</div>,
      cell: ({ row }) => (
        <div>{row.original.product.name}</div>
      )
    },
    {
      accessorKey: 'rating',
      header: () => <div>#Rating </div>
    },
    {
      accessorKey: "text",
      header: () => <div>#MESSAGE</div>
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
        >Delete</Button>
      )
    }
  ]

  return columns
}
