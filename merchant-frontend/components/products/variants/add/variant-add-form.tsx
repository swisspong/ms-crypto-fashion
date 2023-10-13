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
    showSelectValue,
  } = useVariantAddHook();
  console.log(form.formState.errors.variant_selecteds?.root?.message);
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
                            value={showSelectValue(
                              field.value,
                              fieldItem.vgrp_id,
                              productData?.groups
                            )}
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
                                <SelectItem value={"none"}>ไม่ระบุ</SelectItem>
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
                </div>
              </div>
              {form.formState.errors.variant_selecteds?.root?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.variant_selecteds?.root?.message}
                </p>
              )}
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
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/[^0-9]/g, "");
                        field.onChange(Number(numericValue));
                      }}
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
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericValue = inputValue.replace(
                            /[^0-9]/g,
                            ""
                          );
                          field.onChange(Number(numericValue));
                        }}
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
