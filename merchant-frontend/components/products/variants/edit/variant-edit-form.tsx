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
import { MoreHorizontal, Trash2 } from "lucide-react";
import React, { FC } from "react";
import useVariantEditHook from "./use-variant-edit-hook";
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
    productData
  } = useVariantEditHook();
  initForm(variant);
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
                  {/* <SelectListNew
              control={form.control}
              index={index}
              variants={form.getValues("variants")}
              groups={form.getValues("groups")}
            /> */}
                  {/* <Select>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>สี</SelectLabel>
                    <SelectItem value={"34fjdalfds"}>เหลือง</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select> */}
                  {fields.map((fieldItem, index) => (
                    <FormField
                      control={form.control}
                      name={`variant_selecteds.${index}.optn_id`}
                      render={({ field }) => (
                        <FormItem>
                          <Select>
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
                                  {/* {`${groups
                              .find((group) => group.vgrp_id === fieldItem.vgrp_id)
                              ?.name.slice(0, 1)
                              .toUpperCase()}${groups
                              .find((group) => group.vgrp_id === fieldItem.vgrp_id)
                              ?.name.slice(1)}`} */}
                                </SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">
                                  Blueberry
                                </SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                {/* {gr?.options.map((option) => (
                            <SelectItem value={option.optn_id}>{`${option.name
                              .slice(0, 1)
                              .toUpperCase()}${option.name.slice(1)}`}</SelectItem>
                          ))} */}
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
                      // disabled={!isEdit}
                      placeholder="ราคา (ต้องกรอก)"
                      {...field}
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
                        // disabled={!isEdit}
                        placeholder="จำนวน (ต้องกรอก)"
                        {...field}
                      />
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

                          <DropdownMenuItem>เพิ่มขั้นสูง</DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              //   vrntRemove(index);
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Label>จำนวนสินค้า</Label>
              <div className="flex space-x-2">
                <Input type={"number"} placeholder="จำนวนสินค้า" />{" "}
                <Button size={"sm"} className="">
                  ยืนยัน
                </Button>
              </div> */}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default VariantEditForm;
