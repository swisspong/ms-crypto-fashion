"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/input";
import queryString from "query-string";
import { SearchType } from "@/src/types/enums/product";

interface FilterProps {
  data: any[];
  // search: string | undefined;
  setSerarch: Dispatch<SetStateAction<string | undefined>>;
  setSelectedCheckboxes: Dispatch<SetStateAction<string[]>>;
  selectedCheckboxes: string[];
  setSelectType?: Dispatch<SetStateAction<string | undefined>>;
  selectType?: string | undefined;
  // name: string;

  type?: string;
}

const FilterState: React.FC<FilterProps> = ({
  data,
  // name,

  setSelectedCheckboxes,
  selectedCheckboxes,
  // search,
  setSerarch,
  type,
  selectType,
  setSelectType,
}) => {
  // const searchParams = useSearchParams();
  // const router = useRouter();

  // const selectedValue = searchParams.get(valueKey);

  // const onClick = (id: string) => {
  //   const current = qs.parse(searchParams.toString());
  //   console.log(current);
  //   const parsed = qs.parse(location.search);
  //   console.log(parsed);
  //   const query = {
  //     ...current,
  //     [valueKey]: id,
  //   };

  //   if (current[valueKey] === id) {
  //     query[valueKey] = null;
  //   }

  //   const url = qs.stringifyUrl(
  //     {
  //       url: window.location.href,
  //       query,
  //     },
  //     { skipNull: true }
  //   );

  //   router.push(url);
  // };
  // useEffect(() => {
  //   //console.log(selectedCheckboxes)
  //   console.log(queryString.stringify({ cat_ids: selectedCheckboxes }));
  // }, [selectedCheckboxes]);

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold">ค้นหา</h3>
        <hr className="my-4" />
        <Input
          placeholder="search"
          onChange={(e) => setSerarch(e.target.value)}
        />
        {type && type === SearchType.MERCHANT ? (
          <>
            {/* <p className="text-xs font-semibold mt-3">ประเภทการค้นหา:</p> */}
            <p className="text-lg font-semibold mt-3">ประเภทการค้นหา</p>
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <div className="flex items-center space-x-2 border p-2 rounded-md">
                <Checkbox
                  checked={selectType === SearchType.PRODUCT}
                  onCheckedChange={(t) => {
                    setSelectType &&
                      setSelectType((prev) => {
                        if (!t) {
                          return prev;
                        } else {
                          return SearchType.PRODUCT;
                        }
                      });
                  }}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  สินค้า
                </label>
              </div>

              <div className="flex items-center space-x-2 border p-2 rounded-md">
                <Checkbox
                  checked={selectType === SearchType.MERCHANT}
                  onCheckedChange={(t) => {
                    setSelectType &&
                      setSelectType((prev) => {
                        if (!t) {
                          return prev;
                        } else {
                          return SearchType.MERCHANT;
                        }
                      });
                  }}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  ร้านค้า
                </label>
              </div>
            </div>
          </>
        ) : undefined}
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold">
          {/* {name === "Categories" ? "หมวดหมู่" : ""} */}
          หมวดหมู่
        </h3>
        <hr className="my-4" />
        <div className="flex flex-wrap gap-2">
          {data.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center space-x-2 border p-2 rounded-md"
            >
              <Checkbox
                id={filter.id}
                checked={
                  selectedCheckboxes.find((id) => id === filter.id)
                    ? true
                    : false
                }
                onCheckedChange={(t) => {
                  setSelectedCheckboxes((prev) => {
                    if (t) {
                      const item = prev.find((item) => item === filter.id);
                      if (item) {
                        return prev;
                      } else {
                        return [...prev, filter.id];
                      }
                    } else {
                      return prev.filter((item) => item !== filter.id);
                    }
                  });
                }}
              />
              <label
                htmlFor={filter.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {filter.name}
              </label>
            </div>
            // <div key={filter.id} className="flex items-center">

            //   <Button
            //     className={cn(
            //       'rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300',
            //       selectedValue === filter.id && 'bg-black text-white'
            //     )}
            //     onClick={() => onClick(filter.id)}
            //   >
            //     {filter.name}
            //   </Button>
            // </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilterState;
