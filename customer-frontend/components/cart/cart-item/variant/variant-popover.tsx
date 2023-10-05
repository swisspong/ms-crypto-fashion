import React, { FC, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { useEditItemCart } from "@/src/hooks/cart/mutations";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useVariantPopoverHook from "./use-variant-popover-hook";
interface Props {
  //optn?: string;
  data: ICartItem;
}
const VaraintPopover: FC<Props> = ({ data }) => {
  const {
    openPopover,
    popoverOpenChangeHandler,
    showSelectValue,
    onOpenChange,
    selectValueChangeHandler,
    disabledOption,
    openPopoverHandler,
    disabledButton,
    onSubmit,
  } = useVariantPopoverHook(data);
  return (
    <Popover
      open={openPopover}
      modal={true}
      onOpenChange={(open) => {
        popoverOpenChangeHandler(open);
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex">
          <div className="flex space-x-1 bg-muted rounded-sm cursor-pointer grow-0 px-1">
            <span className="flex text-xs items-center whitespace-nowrap sm:text-sm ">
              ตัวเลือก:
            </span>
            <p className=" text-xs  line-clamp-1 sm:text-sm ">
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
            <span className="flex text-xs items-center ">
              <ChevronDown size={10} />
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="grid gap-2">
            {data.product.groups.map((group) => (
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">{group.name}</Label>
                <Select
                  value={showSelectValue(group)}
                  onOpenChange={(open) => onOpenChange(open, group.vgrp_id)}
                  onValueChange={(value) =>
                    selectValueChangeHandler(value, group)
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
                          disabled={disabledOption(option, group.vgrp_id)}
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
              <Button
                className=" col-span-2"
                variant={"ghost"}
                onClick={() => openPopoverHandler(false)}
              >
                ยกเลิก
              </Button>

              <Button
                className=" col-span-2"
                disabled={disabledButton()}
                onClick={() => onSubmit()}
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
