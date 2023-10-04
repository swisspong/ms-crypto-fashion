"use client";

import { Heart, ShoppingCart } from "lucide-react";
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
import { useAddToWishlist } from "@/src/hooks/wishlist/mutations";
import useAddItemHook, { useAddItemHookNew } from "./use-add-item-hook";

interface InfoProps {
  data?: IProductRow;
  canAddToCart?: boolean;
  //setVrntSelected: Dispatch<SetStateAction<string | undefined>>;
  vrntSelectedHandler: (
    selecteds: {
      vgrpId: string;
      optnId: string;
    }[]
  ) => void;
  vrntIdHandler: (data: string | undefined) => void;
  vrntSelected: string | undefined;
  wishlist: ICheckWishList | undefined;
  vrntId: string | undefined;
}
const formSchema = z.object({
  quantity: z.number().int().min(1),
  vrnt_id: z.string().optional(),
});
const Info: React.FC<InfoProps> = ({
  data,
  vrntId,
  vrntIdHandler,
  //setVrntSelected,
  vrntSelectedHandler,
  canAddToCart = false,
  vrntSelected,
  wishlist,
}) => {
  // const {
  //   disableButtonHandler,
  //   onClickToWishlist,
  //   onSubmit,
  //   quantityHandler,
  //   quantity,
  //   selectValueChangeHandler,
  //   disableSelect,
  //   selecteds,
  //   showSelectValue,
  // } = useAddItemHook(data, vrntSelectedHandler, vrntSelected, canAddToCart);
  const {
    disabledOption,
    quantity,
    selectValueChangeHandler,
    whenSelectsChange,
    whenVrntIdSelectedChange,
    showSelectValue,
    selecteds,
    onOpenChange,
    disabledQtyInput,
    activeVgrpId,
    maxQuantity,
    showQuantity,
    qtyChangeHandler,
    disableButton,
    onSubmit,
  } = useAddItemHookNew(data);

  whenSelectsChange(vrntIdHandler);
  whenVrntIdSelectedChange(vrntId);
  // const [quantity, setQuantity] = useState<number>(0);
  // const [selecteds, setSelecteds] = useState<
  //   { vgrpId: string; optnId: string }[]
  // >([]);
  // const { mutate, isSuccess } = useAddToCart();

  // *Wishlist
  const {
    mutate: handleWishlist,
    isLoading: wishlistLoading,
    isSuccess: wishlistSuccess,
  } = useAddToWishlist();

  // useEffect(() => {
  //   if (data) {
  //     setSelecteds(
  //       data.groups.map((group) => ({ vgrpId: group.vgrp_id, optnId: "" }))
  //     );
  //   }
  //   setQuantity(data?.stock && data.stock > 0 ? 1 : 0);
  // }, [data]);

  // useEffect(() => {
  //   console.log(selecteds);
  //   setVrntSelected(
  //     data?.variants.find((variant) =>
  //       variant.variant_selecteds.every((vrnts) =>
  //         selecteds.some(
  //           (slct) =>
  //             slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
  //         )
  //       )
  //     )?.vrnt_id ?? undefined
  //   );
  // }, [selecteds]);

  // useEffect(() => {
  //   if (vrntSelected) {
  //     setQuantity(
  //       data?.variants && data?.variants.length > 0
  //         ? data.variants.some((vrnts) => vrntSelected === vrnts.vrnt_id)
  //           ? 1
  //           : 0
  //         : data?.stock && data.stock > 0
  //           ? 1
  //           : 0
  //     );
  //   }
  // }, [vrntSelected]);

  // const onSubmit = () => {
  //   if (data?.variants && data.variants.length <= 0 && canAddToCart) {
  //     console.log(quantity);
  //     mutate({ prodId: data.prod_id!, body: { quantity } });

  //   } else if (data?.variants) {
  //     const vrnt =
  //       data.variants.find((variant) =>
  //         variant.variant_selecteds.every((vrnts) =>
  //           selecteds.some(
  //             (slct) =>
  //               slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
  //           )
  //         )
  //       )?.vrnt_id ?? undefined;
  //     if (vrnt && canAddToCart) {
  //       mutate({ prodId: data.prod_id!, body: { quantity, vrnt_id: vrnt } });
  //       console.log(quantity, vrnt);
  //     }
  //   }
  // };

  // const onClickToWishlist = () => {
  //   if (data) {
  //     handleWishlist({ prod_id: data.prod_id! })
  //   }
  // }

  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.success("เพิ่มลงตะกร้าสำเร็จ");
  //   }
  // }, [isSuccess]);

  useEffect(() => {
    if (wishlistSuccess) {
      if (!wishlist?.check_wishlist) {
        toast.success("เพิ่มลงสินค้าที่อยากได้สำเร็จ");
      } else if (wishlist?.check_wishlist) {
        toast.success("ยกเลิกสินค้าที่อยากได้สำเร็จ");
      }
    }
  }, [wishlistSuccess]);

  // const disableButtonHandler = (): boolean => {
  //   if (data?.variants && data.variants.length > 0) {
  //     return data.variants.find((variant) =>
  //       variant.variant_selecteds.every((vrnts) =>
  //         selecteds.some(
  //           (slct) =>
  //             slct.optnId === vrnts.optn_id && slct.vgrpId === vrnts.vgrp_id
  //         )
  //       )
  //     )?.vrnt_id
  //       ? false
  //       : true;
  //   } else {
  //     return false;
  //   }
  // };

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
              value={showSelectValue(selecteds, group)}
              onOpenChange={(open) => onOpenChange(open, group.vgrp_id)}
              onValueChange={(value) => selectValueChangeHandler(value, group)}
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
                      //disabled={disableSelect(data, option, selecteds)}
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
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">จำนวนสินค้า:</h3>
          <Input
            type="number"
            max={maxQuantity(vrntId)}
            // max={
            //   data?.variants && data?.variants.length > 0
            //     ? data.variants.find((vrnts) => vrntSelected === vrnts.vrnt_id)
            //         ?.stock ?? 0
            //     : data?.stock && data.stock > 0
            //     ? data.stock
            //     : 0
            // }
            // min={data?.stock && data.stock > 0 ? 1 : 0}
            // min={
            //   data?.variants && data?.variants.length > 0
            //     ? data.variants.some((vrnts) => vrntSelected === vrnts.vrnt_id)
            //       ? 1
            //       : 0
            //     : data?.stock && data.stock > 0
            //     ? 1
            //     : 0
            // }
            // onChange={(e) => quantityHandler(Number(e.target.value))}
            disabled={disabledQtyInput(vrntId)}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            onChange={(e) => qtyChangeHandler(e, vrntId)}
            // readOnly={true}
            value={showQuantity(vrntId)}
            className="w-[180px]"
          />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          onClick={() => onSubmit(canAddToCart)}
          disabled={disableButton(vrntId)}
          //disabled={disableButtonHandler()}
          className="flex items-center gap-x-2"
        >
          เพิ่มเข้าตะกร้า
          <ShoppingCart size={20} />
        </Button>

        <Button
          //onClick={onClickToWishlist}
          className="flex items-center gap-x-2 w-40"
          disabled={wishlistLoading}
        >
          {wishlist?.check_wishlist ? (
            <>
              <span> อยู่ในสิ่งที่อยากซื้อ</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </>
          ) : (
            <>
              <span>สิ่งที่อยากซื้อ</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </>
          )}
        </Button>
      </div>
      <hr className="my-10" />
      <div className="mt-10  gap-x-3">
        <h3 className="font-semibold text-xl text-black underline">
          รายละเอียดสินค้า
        </h3>
        <p className="mt-2 text-muted-foreground">{data?.description}</p>
      </div>
    </div>
  );
};

export default Info;
