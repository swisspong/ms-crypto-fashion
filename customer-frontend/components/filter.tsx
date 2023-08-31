"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

interface FilterProps {
  data: any[];
  name: string;
  valueKey: string;
}

const Filter: React.FC<FilterProps> = ({ data, name, valueKey }) => {
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());
    console.log(current);
    const parsed = qs.parse(location.search);
    console.log(parsed);
    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };
  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query: { cat: selectedCheckboxes },
      },
      { skipNull: true }
    );
    router.push(url);
    const parsed = qs.parse(location.search);
  }, [selectedCheckboxes]);

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Search</h3>
        <hr className="my-4" />
        <Input placeholder="search" />
        <p className="text-xs font-semibold mt-3">Type Search:</p>
        <div className="flex flex-wrap gap-2 mt-2 items-center">
          <div className="flex items-center space-x-2 border p-2 rounded-md">
            <Checkbox />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Product
            </label>
          </div>

          <div className="flex items-center space-x-2 border p-2 rounded-md">
            <Checkbox />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Store
            </label>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold">{name}</h3>
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
                  console.log(t);
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

export default Filter;
