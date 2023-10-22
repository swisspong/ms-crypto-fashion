"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog } from "@headlessui/react";

import Filter from "./filter";
import { Button } from "./ui/button";
import IconButton from "./icon-button";
import { Checkbox } from "./ui/checkbox";
import { SearchType } from "@/src/types/enums/product";
import { Input } from "./ui/input";

interface MobileFiltersProps {
  data: any[];
  search: string | undefined;
  setSerarch: Dispatch<SetStateAction<string | undefined>>;
  setSelectedCheckboxes: Dispatch<SetStateAction<string[]>>;
  selectedCheckboxes: string[];
  setSelectType?: Dispatch<SetStateAction<string | undefined>>;
  selectType?: string | undefined;
  // name: string;

  type?: string;
}

const MobileFilterNew: React.FC<MobileFiltersProps> = ({
  data,
  // name,

  setSelectedCheckboxes,
  selectedCheckboxes,
  search,
  setSerarch,
  type,
  selectType,
  setSelectType,
}) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <Button onClick={onOpen} className="flex items-center gap-x-2 lg:hidden">
        Filters
        <Plus size={20} />
      </Button>

      <Dialog
        open={open}
        as="div"
        className="relative z-40 lg:hidden"
        onClose={onClose}
      >
        {/* Background color and opacity */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        {/* Dialog position */}
        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
            {/* Close button */}
            <div className="flex items-center justify-end px-4">
              <IconButton icon={<X size={15} />} onClick={onClose} />
            </div>

            <div className="p-4">
              <div className="mb-8">
                <h3 className="text-lg font-semibold">ค้นหา</h3>
                <hr className="my-4" />
                <Input
                  placeholder="search"
                  value={search}
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
                              const item = prev.find(
                                (item) => item === filter.id
                              );
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
              {/* <Filter
                valueKey="sizeId"
                name="Sizes"
                data={[
                  { id: "23", name: "test" },
                  { id: "123", name: "testg" },
                ]}
              /> */}
              {/* <Filter valueKey="colorId" name="Colors" data={colors} /> */}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileFilterNew;
