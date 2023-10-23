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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import React, { FC } from "react";
import useVariantEditHook from "./use-variant-edit-hook";
import VariantDeleteDialog from "../delete/variant-delete-dialog";
import VariantAdvancedForm from "../advanced/variant-advanced-form";

interface Props {
  // data: IProductRow
  variant: IVariant;
}
const VariantEditForm: FC<Props> = ({ variant }) => {
  const {
    form,
    fields,
    checkKeyDown,
    onSubmit,
    showSelectPlaceholder,
    initForm,
    productData,
    showSelectItems,
    showSelectValue,
    isEdit,
    toggleEdit,
    cancelForm,
    open,
    toggleHandler,
  } = useVariantEditHook();

  initForm(variant);
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <div className="grid grid-cols-4 gap-4 border-b py-2 relative">
            <div className="grid col-span-4 md:col-span-2 gap-2">
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
                              disabled={!isEdit}
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
                                  <SelectItem value={"none"}>
                                    ไม่ระบุ
                                  </SelectItem>
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
              </div>
            </div>
            <div className="flex flex-col space-y-2 col-span-4 sm:col-span-2 md:col-span-1">
              <FormField
                control={form.control}
                name={`price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ราคา</FormLabel>
                    <FormControl>
                      <Input
                        disabled={!isEdit}
                        placeholder="ราคา (ต้องกรอก)"
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-2 col-span-4 sm:col-span-2 md:col-span-1">
              <FormField
                control={form.control}
                name={`stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวน</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input
                          disabled={!isEdit}
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
                        {isEdit ? (
                          <>
                            <Button type="submit">ยืนยัน</Button>
                            <Button
                              type="button"
                              className="grow-0 shrink-0"
                              size={"icon"}
                              onClick={() => cancelForm(variant)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <VariantDeleteDialog vrntId={variant.vrnt_id} />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="grow-0 shrink-0"
                                >
                                  <span className="sr-only">เปิดเมนู</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>การกระทำ</DropdownMenuLabel>

                                <DropdownMenuItem
                                  onClick={() => toggleHandler(true)}
                                >
                                  เพิ่มขั้นสูง
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={toggleEdit}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  แก้ไข
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        )}
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
      <VariantAdvancedForm
        variant={variant}
        open={open}
        toggleHandler={toggleHandler}
      />
    </>
  );
};

export default VariantEditForm;
