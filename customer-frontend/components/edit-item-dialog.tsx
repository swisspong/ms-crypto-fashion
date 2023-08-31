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
import { useEditItemCart } from "@/src/hooks/cart/mutations";
import { toast } from "react-toastify";
interface Props {
  optn?: string;
  data: ICartItem;
}
const EditItemDialog: FC<Props> = ({ optn, data }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [vrntselected, setVrntSelected] = useState<string | undefined>();
  const [selecteds, setSelecteds] = useState<
    { vgrpId: string; optnId: string }[]
  >([]);
  const { mutate ,isSuccess} = useEditItemCart();
  useEffect(() => {
    setSelecteds(
      data.product.variants
        .find((vrnts) => vrnts.vrnt_id === data.vrnt_id)
        ?.variant_selecteds.map((vrnt_se) => ({
          optnId: vrnt_se.optn_id,
          vgrpId: vrnt_se.vgrp_id,
        })) ?? []
    );
    setQuantity(data.quantity);
  }, [data]);
  useEffect(() => {
    if (selecteds.every((selected) => selected.optnId.trim().length > 0)) {
      const variant = data.product.variants.find((variant) =>
        variant.variant_selecteds.every((vrnts) =>
          selecteds.some(
            (slct) =>
              slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
          )
        )
      );
      if (variant) {
        setVrntSelected(variant.vrnt_id);
        // setQuantity(vrnt?.stock && vrnt.stock > 0 ? 1 : 0);
      } else {
        setVrntSelected(undefined);
      }
    } else {
      setVrntSelected(undefined);
    }
  }, [selecteds]);

  useEffect(()=>{
    if(isSuccess){
        toast.success("Update item success!")
        setOpen(false)
    }
  },[isSuccess])
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          setSelecteds(
            data.product.variants
              .find((vrnts) => vrnts.vrnt_id === data.vrnt_id)
              ?.variant_selecteds.map((vrnt_se) => ({
                optnId: vrnt_se.optn_id,
                vgrpId: vrnt_se.vgrp_id,
              })) ?? []
          );
          setQuantity(data.quantity);
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Badge className="cursor-pointer">{optn}</Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to your item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
            <Image
              fill
              src={data.product?.image_urls[0]}
              alt=""
              className="object-cover object-center"
            />
          </div>
          {data.product.groups.map((group) => (
            <div className="flex items-center gap-x-4">
              <h3 className="font-semibold text-black">{group.name}:</h3>
              <Select
                value={
                  selecteds.find(
                    (selected) => selected.vgrpId === group.vgrp_id
                  )?.optnId ?? undefined
                }
                onValueChange={(value) =>
                  setSelecteds((prev) => {
                    const result = prev.map((groupState) => {
                      if (groupState.vgrpId === group.vgrp_id) {
                        return { ...groupState, optnId: value };
                      }
                      return groupState;
                    });
                    const isSelectedCompolete = result.every(
                      (selected) => selected.optnId.trim().length > 0
                    );
                    console.log(isSelectedCompolete);
                    if (isSelectedCompolete) {
                      const isValid = data.product.variants.some((variant) =>
                        variant.variant_selecteds.every((vrnts) =>
                          result.some(
                            (selected) =>
                              selected.optnId === vrnts.optn_id &&
                              selected.vgrpId === vrnts.vgrp_id
                          )
                        )
                      );

                      if (!isValid) {
                        return result.map((groupState) => {
                          if (groupState.vgrpId === group.vgrp_id) {
                            return { ...groupState, optnId: value };
                          }
                          return { ...groupState, optnId: "" };
                        });
                      }
                    }
                    return result;
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Select a ${group.name}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{group.name}</SelectLabel>
                    <SelectItem value="">Please select</SelectItem>
                    {group.options.map((option) => (
                      <SelectItem
                        disabled={
                          !data.product.variants
                            .filter((variant) => variant.stock > 0)
                            .some((variant) =>
                              variant.variant_selecteds.some(
                                (vrnts) => vrnts.optn_id === option.optn_id
                              )
                            ) ||
                          !data.product.variants
                            .filter((variant) => variant.stock > 0)
                            .filter(
                              (variant) =>
                                selecteds
                                  .filter(
                                    (selected) =>
                                      selected.optnId.trim().length > 0
                                  )
                                  .every((selected) =>
                                    variant.variant_selecteds.some(
                                      (vrnts) =>
                                        vrnts.vgrp_id === selected.vgrpId &&
                                        vrnts.optn_id === selected.optnId
                                    )
                                  ) ||
                                (selecteds.every(
                                  (selected) =>
                                    selected.optnId.trim().length > 0
                                ) &&
                                  (selecteds
                                    .filter(
                                      (selected) =>
                                        selected.optnId.trim().length > 0
                                    )
                                    .every(
                                      (selected) =>
                                        !variant.variant_selecteds.some(
                                          (vrnts) =>
                                            vrnts.vgrp_id === selected.vgrpId &&
                                            vrnts.optn_id === selected.optnId
                                        )
                                    ) ||
                                    selecteds
                                      .filter(
                                        (selected) =>
                                          selected.optnId.trim().length > 0
                                      )
                                      .some((selected) =>
                                        variant.variant_selecteds.some(
                                          (vrnts) =>
                                            vrnts.vgrp_id === selected.vgrpId &&
                                            vrnts.optn_id === selected.optnId
                                        )
                                      )))
                            )
                            .some((variant) =>
                              variant.variant_selecteds.some(
                                (vrnts) => vrnts.optn_id === option.optn_id
                              )
                            )
                        }
                        value={`${option.optn_id}`}
                      >
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Button
              variant={"outline"}
              className=" border rounded-md p-1 cursor-pointer"
              size={"sm"}
              onClick={() =>
                setQuantity((prev) =>
                  (data.product.variants.find(
                    (vrnt) => vrnt.vrnt_id === vrntselected
                  )?.stock ?? 0) > prev
                    ? ++prev
                    : prev
                )
              }
            >
              <Plus className="h-4 w-4 " />
            </Button>

            <span>{quantity}</span>
            <Button
              variant={"outline"}
              className=" border rounded-md p-1 cursor-pointer"
              size={"sm"}
              onClick={() => setQuantity((prev) => (prev > 1 ? --prev : prev))}
            >
              <Minus className="h-4 w-4 cursor-pointer" />
            </Button>
            <div className=" border rounded-md p-2 cursor-pointer">
              in stock{" "}
              {vrntselected
                ? data.product.variants.find(
                    (vrnt) => vrnt.vrnt_id === vrntselected
                  )?.stock
                : 0}
            </div>
            {/* <Currency value={data.product.price} />
            <span>x {data.quantity}</span>
            <span>= {data.product.price * data.quantity}</span> */}
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input id="name" value="Pedro Duarte" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="username" className="text-right">
          Username
        </Label>
        <Input id="username" value="@peduarte" className="col-span-3" />
      </div> */}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={
              quantity >
                (data.product.variants.find(
                  (vrnt) => vrnt.vrnt_id === vrntselected
                )?.stock ?? 0) || !vrntselected
            }
            onClick={() =>
              mutate({
                itemId: data.item_id,
                body: { quantity, vrnt_id: vrntselected },
              })
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
