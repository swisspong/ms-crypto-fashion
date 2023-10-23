import React, { useState, useEffect, FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import * as z from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { Loader2, PlusCircle } from "lucide-react";

// import { ICreateProviderPayload, IProvider } from "@/src/interfaces/provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import FileUpload from "../file-upload";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { useProductById } from "@/src/hooks/product/queries";
import { useRouter } from "next/router";
import FileUploadOne from "../file-upload-one";
import { useEditAdvancedVariant } from "@/src/hooks/product/variant/mutations";
import { toast } from "react-toastify";

interface Props {
  openHandler: (open: boolean) => void;
  open: boolean;
  id: string | undefined;
}

const name = "provider";
const AdvancedVariantForm: FC<Props> = ({ openHandler, open, id }) => {
  const router = useRouter();
  const { data, isLoading, isSuccess, refetch } = useProductById(
    router.query.prodId as string
  );
  const formSchema = z.object({
    // vrnt_id: z.string(),
    variant_selecteds: z
      .array(
        z.object({
          vgrp_id: z.string().trim().min(2),
          optn_id: z.string().trim().min(2),
        })
      )
      .refine(
        (val) => {
          console.log("foudn-==================", data);
          // console.log()
          return !data?.variants.some((variant) => {
            if (
              variant.vrnt_id !== id &&
              variant.variant_selecteds.length === val.length
            ) {
              console.log(
                "in------------------------",
                variant.variant_selecteds,
                val
              );
              const invalid = variant.variant_selecteds.every((vrnts) => {
                const someInvalid = val.some((vrnt) => {
                  if (
                    vrnts.vgrp_id === vrnt.vgrp_id &&
                    vrnts.optn_id === vrnt.optn_id
                  ) {
                    console.log("true -----------");
                    return true;
                  } else {
                    return false;
                  }
                });

                // console.log("result some",someInvalid)
                return someInvalid;
              });
              // console.log("result every",invalid)
              return invalid;
            }
            return false;
          });
        },
        { message: "Group name is duplicate." }
      ),
    price: z.number().min(0),
    stock: z.number().min(0),
    image_url: z.string().url().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // name: "",
      // code: "",
      // price: 0,
    },
  });

  //   useEffect(() => {
  //     if (id > 0) {
  //       const obj = data.find((item) => item.id === id);
  //       if (obj)
  //         form.reset({
  //           code: obj.code,
  //           available: obj.available,
  //           name: obj.name,
  //           price: Number(obj.price),
  //           status: obj.status,
  //           image_url: obj.image_url,
  //         });
  //     }
  //   }, [id]);

  const { mutate, isSuccess: mutateSuccess } = useEditAdvancedVariant();
  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (id <= 0) addHandler(values);
    // else updateHandler(values);
    console.log(values);
    if (id) {
      mutate({
        body: values,
        prodId: router.query.prodId as string,
        vrntId: id,
      });
    }
  }
  useEffect(() => {
    if (mutateSuccess) {
      refetch();
      openHandler(false);
      toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
    }
  }, [mutateSuccess]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "variant_selecteds",
  });
  const imageValue = useWatch({
    control: form.control,
    name: "image_url", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    //defaultValue: "default", // default value before the render
  });
  useEffect(() => {
    if (isSuccess) {
      const variant = data.variants.find((vrnt) => vrnt.vrnt_id === id);
      console.log("adnvaced", variant);
      if (variant) {
        form.reset({
          price: variant.price,
          stock: variant.stock,
          variant_selecteds: variant.variant_selecteds,
          image_url: variant.image_url,
        });
      }
    }
  }, [isSuccess, id]);
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        openHandler(open);
        // if (!addLoading && !updateLoading) {
        //   openHandler(open);
        //   form.reset();
        // }
      }}
    >
      {/* <SheetTrigger asChild>
        <DropdownMenuItem>Advanced</DropdownMenuItem>
 
      </SheetTrigger> */}
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
              {/* <FormField
                control={form.control}
                name=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        //   disabled={addLoading || updateLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Code"
                        {...field}
                        //   disabled={addLoading || updateLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {fields.map((fieldItem, index) => (
                <FormField
                  control={form.control}
                  name={`variant_selecteds.${index}.optn_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        กลุ่มสินค้า{" "}
                        {
                          data?.groups.find(
                            (group) => group.vgrp_id === fieldItem.vgrp_id
                          )?.name
                        }
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        // disabled={addLoading || updateLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data?.groups
                            .find(
                              (group) => group.vgrp_id === fieldItem.vgrp_id
                            )
                            ?.options.map((option) => (
                              <>
                                <SelectItem value={option.optn_id}>
                                  {option.name}
                                </SelectItem>
                              </>
                            ))}
                          {/* <SelectItem value="RENTED">Rent</SelectItem>
                          <SelectItem value="PURCHASED">Purchase</SelectItem> */}
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
                        type="number"
                        {...field}
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
                        type="number"
                        {...field}
                        //   disabled={addLoading || updateLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Price"
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}

                        //   disabled={addLoading || updateLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      // disabled={addLoading || updateLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RENTED">Rent</SelectItem>
                        <SelectItem value="PURCHASED">Purchase</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รูปภาพ</FormLabel>
                    <FormControl>
                      <FileUploadOne
                        onChange={field.onChange}
                        // image_url={field.value}
                        image_url={imageValue}
                        isLoading={false}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUploadHook
                      isLoading={addLoading || updateLoading}
                      onChange={field.onChange}
                      image_url={field.value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
              {/* <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <FormLabel className="text-base">Available</FormLabel>
                    <FormControl className="items-center">
                      <Switch
                        checked={field.value}
                        //   disabled={addLoading || updateLoading}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              /> */}
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
                    Cancel
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
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedVariantForm;
