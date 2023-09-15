import React, { useEffect, useState } from "react";
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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { EditAddressForm } from "./edit-address-form";
import DeleteDialog from "../delete-dialog";
import AddressItem from "./address-item";
import { useMyAddress } from "@/src/hooks/address/queries";
import { useDeleteAddress, useUpdateAddress } from "@/src/hooks/address/mutations";

const AddressList = () => {
  const addresses = useMyAddress();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // TODO: set data address item update
  const [updateData, setUpdateData] = useState<IAddress | undefined>(undefined)
  // TODO: request update address
  const { mutate: updateHandler, isLoading: updateLoading, isSuccess: updateSuccess } = useUpdateAddress()

  // TODO: set data id
  const [id, setId] = useState<string>()
  // TODO: request delete address
  const {mutate: deleteHandler, isLoading: deleteLoading, isSuccess: deleteSuccess} = useDeleteAddress()
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {addresses.data?.map((address) => (
          <AddressItem
            setUpdateHandler={(data: IAddress) => {
              setUpdateData(data)
            }}
            setIdHandler={(id: string) => setId(id)}
            data={address}
            openDeleteHandler={() => setOpenDelete((prev) => !prev)}
            openEditHandler={() => setOpenEdit((prev) => !prev)}
          />
        ))}
      </div>
      <EditAddressForm
        updateHandler={(body: { id: string, data: IAddressPayload }) => updateHandler(body)}
        isSuccess={updateSuccess}
        isLoading={updateLoading}
        data={updateData!}
        open={openEdit}
        openHandler={(open) => setOpenEdit(open)}
      />
      <DeleteDialog
        deleteHandler={() => deleteHandler(id!)}
        isLoading={deleteLoading}
        isSuccess={deleteSuccess}
        open={openDelete}
        openHandler={(o) => setOpenDelete(o)}
      />
    </div>
  );
};

export default AddressList;
