import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import { X } from "lucide-react";
import { PlusCircle } from "lucide-react";
import React from "react";
import useVariantsHook from "./use-variants-hook";
import GroupsAddForm from "./groups/add/groups-add-form";
import GroupsEditForm from "./groups/edit/groups-edit-form";

const Variants = () => {
  const { productData, productLoading } = useVariantsHook();
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-5 grid gap-4">
        <Card>
          <CardHeader className="space-y-1 flex justify-between">
            <div className="flex justify-between">
              <p className="font-semibold tracking-tight text-2xl">
                กลุ่มสินค้า
              </p>
              <Button size={"sm"} type="button">
                <PlusCircle className="mr-2 h-4 w-4" />
                {`เพิ่มกลุ่มสินค้า`}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium leading-none">
                    ตัวเลือก
                  </span>
                  <div className="flex w-full space-x-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>
                    <Button>ยืนยัน</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium leading-none">
                    ตัวเลือก
                  </span>
                  <div className="flex w-full space-x-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>

                    <Button className="grow-0 shrink-0" size={"icon"}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium leading-none">
                    ตัวเลือก
                  </span>
                  <div className="flex w-full space-x-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>

                    <Button className="grow-0 shrink-0" size={"icon"}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium leading-none">
                    ตัวเลือก
                  </span>
                  <div className="flex w-full space-x-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>

                    <Button>ยืนยัน</Button>
                    <Button className="grow-0 shrink-0" size={"icon"}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="">
            {/* <div className="space-x-3 ml-auto">
                  // <input
                  //   key={item.id}
                  //   // {...form.register(`names.${index}.name`)}
                  //   {...form.register(`groups.${index}.name`)}
                  //   defaultValue={item.name}
                  // />
                  {form.formState.isDirty ? (
                    <Button
                      type="button"
                      onClick={() => {
                        form.reset();
                        setIds([]);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button type="submit" className="">
                    Save Changes
                  </Button>
                </div> */}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="space-y-1 flex justify-between">
            <div className="flex justify-between">
              <p className="font-semibold tracking-tight text-2xl">
                กลุ่มสินค้า
              </p>
              <Button size={"sm"} type="button">
                <PlusCircle className="mr-2 h-4 w-4" />
                {`เพิ่มกลุ่มสินค้า`}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {productData?.groups.map((group) => (
              <GroupsEditForm group={group}/>
            ))}
            <GroupsAddForm/>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium leading-none">
                  ตัวเลือก
                </span>
                <div className="flex w-full space-x-2">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>
                  <Button>ยืนยัน</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>
              <div className="grid gap-2 ">
                <div className="">
                  <span className="text-sm font-medium leading-none">
                    ตัวเลือก
                  </span>
                  <div className="flex w-full space-x-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>

                    <Button className="grow-0 shrink-0" size={"icon"}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium leading-none">
                    ตัวเลือก
                  </span>
                  <div className="flex w-full space-x-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>

                    <Button className="grow-0 shrink-0" size={"icon"}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
              <div className="grid gap-2">
                <Label>ดกหฟดหก</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium leading-none">
                    ตัวเลือก
                  </span>
                  <div className="flex w-full space-x-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow"></div>

                    <Button>ยืนยัน</Button>
                    <Button className="grow-0 shrink-0" size={"icon"}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="">
            {/* <div className="space-x-3 ml-auto">
                  // <input
                  //   key={item.id}
                  //   // {...form.register(`names.${index}.name`)}
                  //   {...form.register(`groups.${index}.name`)}
                  //   defaultValue={item.name}
                  // />
                  {form.formState.isDirty ? (
                    <Button
                      type="button"
                      onClick={() => {
                        form.reset();
                        setIds([]);
                      }}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button type="submit" className="">
                    Save Changes
                  </Button>
                </div> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Variants;
