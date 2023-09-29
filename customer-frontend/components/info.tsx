"use client";

import { ShoppingCart } from "lucide-react";
import Currency from "./currency";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAddToCart } from "@/src/hooks/cart/mutations";
import { toast } from "react-toastify";

interface InfoProps {
  data?: IProductRow;
  canAddToCart?: boolean;
  setVrntSelected: Dispatch<SetStateAction<string | undefined>>;
  vrntSelected: string | undefined;
}
const formSchema = z.object({
  quantity: z.number().int().min(1),
  vrnt_id: z.string().optional(),
});
const Info: React.FC<InfoProps> = ({
  data,
  setVrntSelected,
  canAddToCart = false,
  vrntSelected,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [selecteds, setSelecteds] = useState<
    { vgrpId: string; optnId: string }[]
  >([]);
  const { mutate, isSuccess } = useAddToCart();
  useEffect(() => {
    if (data) {
      setSelecteds(
        data.groups.map((group) => ({ vgrpId: group.vgrp_id, optnId: "" }))
      );
    }
    setQuantity(data?.stock && data.stock > 0 ? 1 : 0);
  }, [data]);

  useEffect(() => {
    console.log(selecteds);
    setVrntSelected(
      data?.variants.find((variant) =>
        variant.variant_selecteds.every((vrnts) =>
          selecteds.some(
            (slct) =>
              slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
          )
        )
      )?.vrnt_id ?? undefined
    );
  }, [selecteds]);

  useEffect(() => {
    if (vrntSelected) {
      setQuantity(
        data?.variants && data?.variants.length > 0
          ? data.variants.some((vrnts) => vrntSelected === vrnts.vrnt_id)
            ? 1
            : 0
          : data?.stock && data.stock > 0
          ? 1
          : 0
      );
    }
  }, [vrntSelected]);
  const onSubmit = () => {
    if (data?.variants && data.variants.length <= 0 && canAddToCart) {
      console.log(quantity);
      mutate({ prodId: data.prod_id!, body: { quantity } });
    } else if (data?.variants) {
      const vrnt =
        data.variants.find((variant) =>
          variant.variant_selecteds.every((vrnts) =>
            selecteds.some(
              (slct) =>
                slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
            )
          )
        )?.vrnt_id ?? undefined;
      if (vrnt && canAddToCart) {
        mutate({ prodId: data.prod_id!, body: { quantity, vrnt_id: vrnt } });
        console.log(quantity, vrnt);
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("เพิ่มลงตะกร้าสำเร็จ");
    }
  }, [isSuccess]);

  const disableButtonHandler = (): boolean => {
    if (data?.variants && data.variants.length > 0) {
      return data.variants.find((variant) =>
        variant.variant_selecteds.every((vrnts) =>
          selecteds.some(
            (slct) =>
              slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
          )
        )
      )?.vrnt_id
        ? false
        : true;
    } else {
      return false;
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900 flex space-x-2">
          {data?.variants && data.variants.length > 1 ? (
            data.variants
              .reduce(
                (prev: [undefined | number, undefined | number], curr) => {
                  prev[0] =
                    prev[0] === undefined || curr.price < prev[0]
                      ? curr.price
                      : prev[0];
                  prev[1] =
                    prev[1] === undefined || curr.price > prev[1]
                      ? curr.price
                      : prev[1];
                  return prev;
                },
                [undefined, undefined]
              )
              .map((val, index) => (
                <>
                  <Currency value={val} />
                  {index === 0 ? <div>~</div> : undefined}
                </>
              ))
          ) : (
            <Currency
              value={
                data?.variants && data.variants.length > 0
                  ? data.variants[0].price
                  : data?.price
              }
            />
          )}
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        {/* {data?.groups.map((group) => (
          <div className="flex items-center gap-x-4">
            <h3 className="font-semibold text-black">{group.name}:</h3>
            <Select
              value={
                selecteds.find((selected) => selected.vgrpId === group.vgrp_id)
                  ?.optnId ?? undefined
              }
              onValueChange={(value) =>
                setSelecteds((prev) => {
                  const result = prev.map((groupState) => {
                    if (groupState.vgrpId === group.vgrp_id) {
                      return { ...groupState, optnId: value };
                    }
                    return groupState;
                  });
                  const isSelectedCompolete = result.every((selected) =>
                    selected?.optnId ? true : false
                  );
                  console.log(isSelectedCompolete);
                  if (isSelectedCompolete) {
                    const isValid = data.variants.some((variant) =>
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
                  {group.options.map((option) => (
                    <SelectItem
                      disabled={
                        !data.variants
                          .filter((variant) => variant.stock > 0)
                          .some((variant) =>
                            variant.variant_selecteds.some(
                              (vrnts) => vrnts.optn_id === option.optn_id
                            )
                          ) ||
                        !data.variants
                          .filter((variant) => variant.stock > 0)
                          .filter(
                            (variant) =>
                              selecteds
                                .filter((selected) =>
                                  selected?.optnId ? true : false
                                )
                                .every((selected) =>
                                  variant.variant_selecteds.some(
                                    (vrnts) =>
                                      vrnts.vgrp_id === selected.vgrpId &&
                                      vrnts.optn_id === selected.optnId
                                  )
                                ) ||
                              (selecteds.every((selected) =>
                                selected?.optnId ? true : false
                              ) &&
                                (selecteds
                                  .filter((selected) =>
                                    selected?.optnId ? true : false
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
                                    .filter((selected) =>
                                      selected.optnId ? true : false
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
        ))} */}
        {data?.groups.map((group) => (
          <div className="flex items-center gap-x-4">
            <h3 className="font-semibold text-black">{group.name}:</h3>
            <Select
              value={
                selecteds.find((selected) => selected.vgrpId === group.vgrp_id)
                  ?.optnId ?? undefined
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
                    const isValid = data.variants.some((variant) =>
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
                  <SelectItem value="">กรุณาเลือก</SelectItem>
                  {group.options.map((option) => (
                    <SelectItem
                      disabled={
                        !data.variants
                          .filter((variant) => variant.stock > 0)
                          .some((variant) =>
                            variant.variant_selecteds.some(
                              (vrnts) => vrnts.optn_id === option.optn_id
                            )
                          ) ||
                        !data.variants
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
                                (selected) => selected.optnId.trim().length > 0
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
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">จำนวนสินค้า:</h3>
          <Input
            type="number"
            max={
              data?.variants && data?.variants.length > 0
                ? data.variants.find((vrnts) => vrntSelected === vrnts.vrnt_id)
                    ?.stock ?? 0
                : data?.stock && data.stock > 0
                ? data.stock
                : 0
            }
            // min={data?.stock && data.stock > 0 ? 1 : 0}
            min={
              data?.variants && data?.variants.length > 0
                ? data.variants.some((vrnts) => vrntSelected === vrnts.vrnt_id)
                  ? 1
                  : 0
                : data?.stock && data.stock > 0
                ? 1
                : 0
            }
            onChange={(e) => setQuantity(Number(e.target.value))}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            // readOnly={true}
            value={quantity}
            className="w-[180px]"
          />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          onClick={onSubmit}
          disabled={disableButtonHandler()}
          className="flex items-center gap-x-2"
        >
          เพิ่มเข้าตะกร้า
          <ShoppingCart size={20} />
        </Button>
      </div>
      <hr className="my-10" />
      <div className="mt-10  gap-x-3">
        <h3 className="font-semibold text-xl text-black underline">
          รายละเอียดสินค้า
        </h3>
        <p className="mt-2 text-muted-foreground">{data?.description}</p>
        {/* <Button className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart size={20} />
        </Button> */}
      </div>
    </div>
  );
};

export default Info;
