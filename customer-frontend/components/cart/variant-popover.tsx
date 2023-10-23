import React, { FC, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEditItemCart } from "@/src/hooks/cart/mutations";
import { toast } from "react-toastify";
interface Props {
  //optn?: string;
  data: ICartItem;
}
const VaraintPopover: FC<Props> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [vrntselected, setVrntSelected] = useState<string | undefined>();
  const { mutate, isSuccess } = useEditItemCart();
  const [selecteds, setSelecteds] = useState<
    { vgrpId: string; optnId: string }[]
  >([]);
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
  useEffect(() => {
    if (isSuccess) {
      toast.success("แก้ไขสำเร็จ!");
      setOpen(false);
    }
  }, [isSuccess]);
  return (
    <Popover
      open={open}
      modal={true}
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
      <PopoverTrigger asChild>
        <div className="flex space-x-1 bg-muted rounded-sm cursor-pointer">
          <span className="flex text-xs items-center whitespace-nowrap sm:text-sm">
            ตัวเลือก:
          </span>
          <p className=" text-xs  line-clamp-1 sm:text-sm">
            {data.product.variants
              .find((vrnt) => vrnt.vrnt_id === data.vrnt_id)
              ?.variant_selecteds.map((vrnts) => {
                const group = data.product.groups.find(
                  (group) => group.vgrp_id === vrnts.vgrp_id
                );
                const option = group?.options.find(
                  (optn) => optn.optn_id === vrnts.optn_id
                );
                return option?.name;
              })
              .map((optn) => {
                return optn;
              })
              .join(", ")}
          </p>
          <span className="flex text-xs items-center">
            <ChevronDown size={10} />
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {/* <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div> */}
          <div className="grid gap-2">
            {data.product.groups.map((group) => (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">{group.name}</Label>
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
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder={`Select a ${group.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{group.name}</SelectLabel>
                      <SelectItem value="">กรุณาเลือก</SelectItem>
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
                                              vrnts.vgrp_id ===
                                                selected.vgrpId &&
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
                                              vrnts.vgrp_id ===
                                                selected.vgrpId &&
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

            <div className="grid grid-cols-4 items-center gap-2">
              <Button className=" col-span-2" variant={"ghost"} onClick={()=>setOpen(false)}>
                ยกเลิก
              </Button>

              <Button
                className=" col-span-2"
                onClick={() =>
                  mutate({
                    itemId: data.item_id,
                    body: { quantity, vrnt_id: vrntselected },
                  })
                }
              >
                ยืนยัน
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VaraintPopover;
