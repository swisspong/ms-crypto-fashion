import React, { Dispatch, FC, SetStateAction } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Edit, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
interface Props {
  checkbox?: boolean;
  selected?: string;
  data: IAddress;
  setUpdateHandler: (data: IAddress) => void;
  setAddressSelected?: Dispatch<SetStateAction<string | undefined>>;
  openEditHandler: () => void;
  openDeleteHandler: () => void;
  setIdHandler: (id: string) => void;
}
const AddressItem: FC<Props> = ({
  checkbox = false,
  openDeleteHandler,
  openEditHandler,
  setUpdateHandler,
  data,
  selected,
  setAddressSelected,
  setIdHandler
}) => {
  return (
    <Card>
      <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <div className="flex space-x-2 items-center">
              {checkbox ? (
                <div>
                  <Checkbox
                    id={data.addr_id}
                    checked={data.addr_id === selected}
                    onCheckedChange={(checked) => {
                      if (setAddressSelected) {
                        setAddressSelected(data.addr_id);
                      }
                    }}
                  />
                  <label
                    htmlFor={data.addr_id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex space-x-2 items-center"
                  ></label>
                </div>
              ) : undefined}
              <p className="font-medium">{data.recipient}</p>
              <div>|</div>
              <p className="font-normal text-sm">{data.tel_number}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setUpdateHandler(data)
                openEditHandler()
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setIdHandler(data.addr_id)
                openDeleteHandler()
              }}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="">
        <p className="text-sm text-foreground">{data.address}</p>
        <p className="text-sm">{data.post_code}</p>
      </CardContent>
    </Card>
  );
};

export default AddressItem;
