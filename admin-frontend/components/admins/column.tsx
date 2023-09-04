"use client"

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
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
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
    const columns: ColumnDef<IAdmin>[] = [
        {
            accessorKey: "username",
            header: () => <div>#Admin</div>
        },
        {
            accessorKey: "email",
            header: () => <div>#Email</div>
        },
        {
          accessorKey: 'permission',
          header: () => <div>#Permissions</div>,
          cell: ({row}) => {
            return (
              <div>
                {row.original.permission.length > 0? row.original.permission.map((val, index) => (
                  <Badge key={val} className="m-1" variant="secondary">{val}</Badge>
                )): (<div className="ml-3">No permissions</div>)}
              </div>
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
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(row.original.user_id.toString());
                      }}
                    >
                      Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
    
                    <Link href={`/admins/edit/${row.original.user_id}`} passHref>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdHandler(row.original.user_id as string);
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
    ]

    return columns
  }
 