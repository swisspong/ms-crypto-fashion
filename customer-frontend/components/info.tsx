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
  vrntIdHandler: (data: string | undefined) => void;
  // vrntSelected: string | undefined;
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
  canAddToCart = false,
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
    whenDataChange,
    showCurrentPrice,
    hasVariant,
    showCurrentVariantStock,
  } = useAddItemHookNew(data);
  whenDataChange();
  whenSelectsChange(vrntIdHandler);
  whenVrntIdSelectedChange(vrntId);

  const {
    mutate: handleWishlist,
    isLoading: wishlistLoading,
    isSuccess: wishlistSuccess,
  } = useAddToWishlist();

  const onClickToWishlist = () => {
    if (data && canAddToCart) {
      handleWishlist({ prod_id: data.prod_id! });
    }
  };

  useEffect(() => {
    if (wishlistSuccess) {
      if (!wishlist?.check_wishlist) {
        toast.success("เพิ่มลงสินค้าที่อยากได้สำเร็จ");
      } else if (wishlist?.check_wishlist) {
        toast.success("ยกเลิกสินค้าที่อยากได้สำเร็จ");
      }
    }
  }, [wishlistSuccess]);

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
            disabled={disabledQtyInput(vrntId)}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            onChange={(e) => qtyChangeHandler(e, vrntId)}
            value={showQuantity(vrntId)}
            className="w-[180px]"
          />
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">จำนวนคงเหลือ: </h3>
          <h3 className="text-black">
            {hasVariant
              ? showCurrentVariantStock(vrntId) === undefined
                ? "กรุณาเลือก"
                : showCurrentVariantStock(vrntId)
              : maxQuantity(vrntId)}
          </h3>
        </div>
        {hasVariant ? (
          <div className="flex items-center gap-x-4">
            <h3 className="font-semibold text-black">ราคา: </h3>
            <h3 className="text-black">
              {showCurrentPrice(vrntId) === undefined
                ? "กรุณาเลือก"
                : showCurrentPrice(vrntId)}
            </h3>
          </div>
        ) : undefined}
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          onClick={() => onSubmit(canAddToCart)}
          disabled={disableButton(vrntId)}
          className="flex items-center gap-x-2"
        >
          เพิ่มเข้าตะกร้า
          <ShoppingCart size={20} />
        </Button>

        <Button
          onClick={onClickToWishlist}
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
