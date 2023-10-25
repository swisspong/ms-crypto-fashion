"use client";
import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import {
  useEditItemCart,
  useRemoveManyItemInCart,
} from "@/src/hooks/cart/mutations";
import { toast } from "react-toastify";
import CartItemRemove from "./cart-item-remove";
interface Props {
  optn?: string;
  data?: ICartItem[];
}
const RemoveItemDialog: FC<Props> = ({ optn, data }) => {
  const [open, setOpen] = useState<boolean>(false);
  const removeAll = useRemoveManyItemInCart();
  useEffect(() => {
    if (data && data.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [data]);

  useEffect(() => {
    if (removeAll.isSuccess) {
      setOpen(false);
    }
  }, [removeAll.isSuccess]);
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Product info has changed</DialogTitle>
          <DialogDescription>
            Make changes to your item here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
            <Image
              fill
              src={data.product?.image_urls[0]}
              alt=""
              className="object-cover object-center"
            />
          </div> */}
        </div>
        {data?.map((item) => (
          <CartItemRemove key={item.item_id} data={item} />
        ))}
        <DialogFooter>
          <Button
            onClick={() =>
              removeAll.mutate({
                items: data?.map((item) => item.item_id) ?? [],
              })
            }
            type="submit"
          >
            Remove all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveItemDialog;
