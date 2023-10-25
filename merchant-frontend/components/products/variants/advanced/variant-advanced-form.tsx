import FileUploadOne from "@/components/file-upload-one";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { FC } from "react";
import useVariantAdvancedHook from "./use-variant-advanced-hook";

interface Props {
  variant: IVariant;
  open: boolean;
  toggleHandler: (value: boolean) => void;
}
const VariantAdvancedForm: FC<Props> = ({ variant, open, toggleHandler }) => {
  const {
    fields,
    imageValue,
    onSubmit,
    form,
    productData,
    useInitForm,
    editLoading,
    useWhenEditSuccess,
    showSelectValue,
    showSelectItems,
    showSelectPlaceholder,
  } = useVariantAdvancedHook();
  useInitForm(variant, open);
  useWhenEditSuccess(() => {
    toggleHandler(false);
  });
  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(o) => {
          if (!editLoading) toggleHandler(o);
        }}
      >
        <SheetContent position={"right"} size="content" className="p-0">
          <ScrollArea className="h-full w-full rounded-md border p-6">
            <SheetHeader>
              <SheetTitle>{`จัดการรูปแบบสินค้าขั้นสูง `}</SheetTitle>
              <SheetDescription>
                {`ทำการเปลี่ยนแปลงรูปแบบสินค้าของคุณที่นี่ คลิกบันทึกเมื่อคุณทำเสร็จแล้ว`}
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-1"
              >
                {fields.map((fieldItem, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`variant_selecteds.${index}.optn_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          กลุ่มสินค้า{" "}
                          {showSelectPlaceholder(
                            fieldItem.vgrp_id,
                            productData
                          )}
                        </FormLabel>
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
                                <SelectItem
                                  key={option.optn_id}
                                  value={option.optn_id}
                                >
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

                {form.formState.errors.variant_selecteds?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.variant_selecteds?.message}
                  </p>
                )}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ราคา</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Price"
                          //type="number"
                          {...field}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(
                              /[^0-9]/g,
                              ""
                            );
                            field.onChange(Number(numericValue));
                          }}
                          //   disabled={addLoading || updateLoading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>จำนวนสินค้า</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Stock"
                          // type="number"
                          {...field}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(
                              /[^0-9]/g,
                              ""
                            );
                            field.onChange(Number(numericValue));
                          }}
                          //   disabled={addLoading || updateLoading}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รูปภาพ</FormLabel>
                      <FormControl>
                        <FileUploadOne
                          onChange={field.onChange}
                          fixSize
                          // image_url={field.value}
                          image_url={imageValue}
                          isLoading={false}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-2 justify-end">
                  {form.formState.isDirty ? (
                    <Button
                      type="reset"
                      className=""
                      onClick={() => {
                        form.reset();
                        // setIds([]);
                      }}
                    >
                      ยกเลิก
                    </Button>
                  ) : null}
                  <Button
                    //   disabled={addLoading || updateLoading}
                    type="submit"
                    // className=""
                  >
                    {/* {addLoading || updateLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null} */}
                    ยืนยัน
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default VariantAdvancedForm;
