import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import useVariantAddHook from "./use-variant-add-hook";

const VariantAddForm = () => {
  const {
    form,
    fields,
    checkKeyDown,
    onSubmit,
    showSelectPlaceholder,
    productData,
    showSelectItems,
  } = useVariantAddHook();
  console.log(form.watch(`variant_selecteds`));
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <div className="grid grid-cols-4 gap-4 border-b py-2 relative">
          <div className="grid col-span-2 gap-2">
            <div className="space-y-2">
              <span className="text-sm font-medium leading-none">
                ส่วนเสริมรูปแบบ
              </span>
              <div className="flex w-full space-x-2">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow">
                  {fields.map((fieldItem, index) => (
                    <FormField
                      control={form.control}
                      name={`variant_selecteds.${index}.optn_id`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                            }}
                            defaultValue={
                              field.value.trim().length > 0
                                ? field.value
                                : undefined
                            }
                            value={
                              field.value.trim().length > 0 &&
                              productData?.groups
                                .find(
                                  (group) => group.vgrp_id === fieldItem.vgrp_id
                                )
                                ?.options.find(
                                  (option) => option.optn_id === field.value
                                )
                                ? field.value
                                : undefined
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={`เลือก ${showSelectPlaceholder(
                                    fieldItem.vgrp_id,
                                    productData
                                  )}`}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>
                                  {showSelectPlaceholder(
                                    fieldItem.vgrp_id,
                                    productData
                                  )}
                                </SelectLabel>
                                {showSelectItems(
                                  fieldItem.vgrp_id,
                                  productData?.groups
                                ).map((option) => (
                                  <SelectItem value={option.optn_id}>
                                    {option.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  {/* <Select>
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name={`price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ราคา</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ราคา (ต้องกรอก)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name={`stock`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>จำนวน</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="จำนวน (ต้องกรอก)"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <Button type="submit" size={"sm"} className="">
                        ยืนยัน
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default VariantAddForm;
