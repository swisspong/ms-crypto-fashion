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
      header: () => <div>#Merchant</div>,
      cell: ({row}) => (
        <div className="flex items-center space-x-3">
          <img src={row.original.banner_url ??
              "https://t4.ftcdn.net/jpg/04/99/93/31/360_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"} className="object-cover h-14 w-14 rounded-md" alt="img_merchant" />
          <div>{row.original.name}</div>
        </div>
      )
    },
    {
      accessorKey: "banner_title",
      header: () => <div>#Banner</div>
    },
    {
      accessorKey: "status",
      header: () => <div>#STATUS</div>,
      cell: ({row}) => (
        <Badge variant="secondary">{row.original.status?? "No Status"}</Badge>
    )
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
                    navigator.clipboard.writeText(row.original.mcht_id.toString());
                  }}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <Link href={`merchants/edit/${row.original.mcht_id}`} passHref>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
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
