import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ChevronRight,
  Edit,
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { EditAddressForm } from "./edit-address-form";
import DeleteDialog from "../delete-dialog";
import AddressItem from "./address-item";
import { useMyAddress } from "@/src/hooks/address/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { AddAddressForm } from "./add-address-form";

interface Props {
  selected?: string;
  // open: boolean;
  setAddressSelected: Dispatch<SetStateAction<string | undefined>>;
}
const AddressListDialog: FC<Props> = ({ selected, setAddressSelected }) => {
  const addresses = useMyAddress();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="self-center" variant={"outline"} size={"sm"}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Address information</DialogTitle>
            <DialogDescription>
              Select your address here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="h-96">
            <ScrollArea className="h-full w-full rounded-lg border-r pr-2">
              <div className="grid gap-4">
                {addresses.data?.map((address) => (
                  <AddressItem
                    setAddressSelected={setAddressSelected}
                    checkbox={true}
                    selected={selected}
                    data={address}
                    openDeleteHandler={() => setOpenDelete((prev) => !prev)}
                    openEditHandler={() => setOpenEdit((prev) => !prev)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <AddAddressForm>
              <Button type="submit" className="w-full">
                <PlusCircle />
              </Button>
            </AddAddressForm>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-2 gap-4"></div>
      <EditAddressForm
        open={openEdit}
        openHandler={(open) => setOpenEdit(open)}
      />
      <DeleteDialog
        deleteHandler={() => {}}
        isLoading={false}
        isSuccess={false}
        open={openDelete}
        openHandler={(o) => setOpenDelete(o)}
      />
    </>
  );
};

export default AddressListDialog;
