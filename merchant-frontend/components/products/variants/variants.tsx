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
import VariantAddForm from "./add/variant-add-form";
import VariantEditForm from "./edit/variant-edit-form";

const Variants = () => {
  const { productData, productLoading, delVgrpId, setDelVgrpIdHandler } =
    useVariantsHook();
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-5 grid gap-4">
        <Card>
          <CardHeader className="space-y-1 flex justify-between p-2 md:p-6">
            <div className="flex justify-between">
              <p className="font-semibold tracking-tight text-2xl">
                กลุ่มสินค้า
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0 p-2 md:p-6 md:pt-0 ">
            {productData?.groups.map((group) => (
              <GroupsEditForm
                group={group}
                delVgrpId={delVgrpId}
                setDelVgrpIdHandler={setDelVgrpIdHandler}
              />
            ))}
            <GroupsAddForm />
            {/* <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
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
            </div> */}
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
        <Card className="mt-4">
          <CardHeader className="space-y-1 flex justify-between p-2 md:p-6">
            <div className="flex justify-between">
              <p className="font-semibold tracking-tight text-2xl">
                ส่วนเสริมรูปแบบ
              </p>
              {/* <Button
                size={"sm"}
                type="button"
                onClick={() =>
                  vrntAppend({
                    vrnt_id: genId("vrnt"),
                    stock: 0,
                    price: 0,
                    variant_selecteds: form
                      .getValues("groups")
                      .map((group) => ({
                        vgrp_id: group.vgrp_id,
                        optn_id: "",
                      })),
                    // options: [],
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {`เพิ่มรูปแบบ`}
              </Button> */}
            </div>
          </CardHeader>

          <CardContent className="pt-0 p-2 md:p-6 md:pt-0">
            {productData?.variants.map((variant) => (
              <VariantEditForm variant={variant} />
            ))}
            <VariantAddForm />
            {/* {vrntFields.map((field, index) => (
              <div
                className="grid grid-cols-4 gap-4 border-b py-2 relative"
                key={field.id}
              >
                <div className="grid col-span-2 gap-2">
                  <div className="space-y-2">
                    <span className="text-sm font-medium leading-none">
                      ส่วนเสริมรูปแบบ
                    </span>
                    <div className="flex w-full space-x-2">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow">
                        <SelectListNew
                          control={form.control}
                          index={index}
                          variants={form.getValues("variants")}
                          groups={form.getValues("groups")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.price`}
                    //name={`groups.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ราคา</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="จำนวนราคา (ต้องกรอก)"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                Number(allowOnlyNumber(e.target.value))
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex space-x-2">
                    <div className="grow">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.stock`}
                        //name={`groups.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>จำนวนสินค้า</FormLabel>
                            <FormControl>
                              <Input
                                type={"number"}
                                placeholder="จำนวนสินค้า"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number(allowOnlyNumber(e.target.value))
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 self-center"
                        >
                          <span className="sr-only">เปิดเมนู</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>การกระทำ</DropdownMenuLabel>
                        {field.vrnt_id ? (
                          <DropdownMenuItem
                            disabled={form.formState.isDirty}
                            onClick={() => {
                              openSheetHandler();
                              if (
                                data?.variants.some(
                                  (variant) => variant.vrnt_id === field.vrnt_id
                                )
                              ) {
                                setIdToUpdate(field.vrnt_id);
                              }
                            }}
                          >
                            เพิ่มขั้นสูง
                          </DropdownMenuItem>
                        ) : null}

                        <DropdownMenuItem
                          onClick={() => {
                            vrntRemove(index);
                            // if (!field.vrnt_id) {
                            // } else {
                            //   setIds((prev) => [...prev, field.variant!]);
                            // }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))} */}
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Variants;
