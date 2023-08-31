"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal, PlusCircle, Trash, Trash2, X } from "lucide-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import InputEnter from "../input-enter";
import VariantsForm from "./variants-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SelectListNew from "./select-list-new";
import ShortUniqueId from "short-unique-id";
import { useProductById } from "@/src/hooks/product/queries";
import { useRouter } from "next/router";
import { useUpsertVariant } from "@/src/hooks/product/variant/mutations";
import { toast } from "react-toastify";
import AdvancedVariantForm from "./advanced-variant-form";
const formSchema = z.object({
  groups: z
    .array(
      z.object({
        vgrp_id: z.string().min(15),
        name: z.string().min(4),
        options: z.array(
          z.object({ optn_id: z.string().trim().min(2), name: z.string() })
        ),
      })
    )
    .min(1)
    .refine(
      (val) => {
        return val.find((item, index) =>
          val.find(
            (item2, index2) => item.name === item2.name && index !== index2
          )
        )
          ? false
          : true;
      },
      { message: "Group name is duplicate." }
    ),
  variants: z
    .array(
      z.object({
        vrnt_id: z.string(),
        variant_selecteds: z.array(
          z.object({
            vgrp_id: z.string().trim().min(2),
            optn_id: z.string().trim().min(2),
          })
        ),
        price: z.number().min(0),
        stock: z.number().min(0),
      })
    )
    .min(1)
    .refine(
      (val) => {
        return !val.some((item, index) => {
          // val.find(
          //   (item2, index2) => item.name === item2.name && index !== index2
          // )
          return val.some((itm, idx) => {
            if (
              item.variant_selecteds.length === itm.variant_selecteds.length
            ) {
              return itm.variant_selecteds.every((vrnts) =>
                item.variant_selecteds.some((vrnts2) => {
                  if (
                    vrnts.vgrp_id === vrnts2.vgrp_id &&
                    vrnts.optn_id === vrnts2.optn_id &&
                    index !== idx
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                })
              );
            } else {
              return false;
            }
          });
        });
        // ? false
        // : true;
      },
      { message: "Group name is duplicate." }
    ),
});
const VariantAllForm = () => {
  const [idToUpdate, setIdToUpdate] = useState<string | undefined>(undefined);
  const openSheetHandlerParam = (con: boolean) => {
    if (!con) {
      setIdToUpdate(undefined);
    }
    setOpen(con);
  };
  const router = useRouter();
  const { data, isLoading, isSuccess, refetch } = useProductById(
    router.query.prodId as string
  );
  const {
    mutate,
    isLoading: upsertLoading,
    isSuccess: upsertSuccess,
  } = useUpsertVariant();

  useEffect(() => {
    if (upsertSuccess) {
      toast.success("Save data successfully");
      refetch();
    }
  }, [upsertSuccess]);
  const [ids, setIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // groups: [
      //   {
      //     g_id: "fds",
      //     name: "Size",
      //     options: [
      //       {
      //         name: "Small",
      //       },
      //     ],
      //   },
      // ],
    },
  });
  const genId = (prefix: string) => {
    const uid = new ShortUniqueId();
    return `${prefix}_${uid.stamp(15)}`;
  };
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "groups",
  });
  const {
    fields: vrntFields,
    append: vrntAppend,
    remove: vrntRemove,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
    mutate({ prodId: router.query.prodId as string, body: values });
  }
  const allowOnlyNumber = (value: any) => {
    if (Number(value) <= 0) {
      return 0;
    }

    return value;
  };
  const openSheetHandler = () => {
    setOpen((prev) => !prev);
  };

  const groupTest = useWatch({
    control: form.control,
    name: "groups", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    //defaultValue: "default", // default value before the render
  });

  useEffect(() => {
    console.log("eff");
    console.log(form.getValues("groups"));
    // {
    //     price: 0,
    //     variant: form.getValues("groups").map((group) => ({
    //       vrnt_id: "",
    //       optn_id: "",
    //     }
    const groups = form.getValues("groups");

    const variants = form.getValues("variants");
    const newGroups = groups.filter((group) =>
      variants.find((variant) =>
        variant.variant_selecteds.find((vrnt) => vrnt.vgrp_id === group.vgrp_id)
          ? false
          : true
      )
        ? true
        : false
    );
    console.log("new ", groups);
    const newVariants = variants.map((variant) => {
      const vrnt = variant.variant_selecteds
        .filter((vrnt) =>
          groups.find((group) => group.vgrp_id === vrnt.vgrp_id) ? true : false
        )
        .map((vrnt) => {
          const group = groups
            .find((group) => group.vgrp_id === vrnt.vgrp_id)
            ?.options.find((optn) => optn.optn_id === vrnt.optn_id)
            ? true
            : false;
          if (group) return vrnt;
          return { ...vrnt, optn_id: "" };
        });
      return { ...variant, variant: vrnt };

      //return vrnt;
    });
    // form.setValue("variants", [
    //   ...newVariants.map((vrnt) => ({
    //     ...vrnt,
    //     variant: [
    //       ...vrnt.variant,
    //       ...newGroups.map((vgrp) => ({ vgrp_id: vgrp.vgrp_id!, optn_id: "" })),
    //     ],
    //   })),
    // ]);
    form.setValue("variants", [
      ...variants.map((variant) => {
        return {
          ...variant,
          variant_selecteds: groupTest?.map((group) => {
            const tmpVrnt = variant.variant_selecteds.find(
              (vrnt_selected) => vrnt_selected.vgrp_id === group.vgrp_id
            );
            const found = group.options.find(
              (optn) => optn.optn_id === tmpVrnt?.optn_id
            );
            if (found) {
              return { vgrp_id: group.vgrp_id, optn_id: found.optn_id };
            } else {
              return { vgrp_id: group.vgrp_id, optn_id: "" };
            }
          }),
        };
      }),
    ]);
  }, [groupTest]);
  useEffect(() => {
    if (data) {
      form.reset({
        groups: data.groups,
        variants: data.variants,
      });
    }
  }, [isSuccess]);
  // form.trigger("groups").then((res) => console.log(res));
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-5 grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className="space-y-1 flex justify-between">
                <div className="flex justify-between">
                  <p className="font-semibold tracking-tight text-2xl">
                    Groups
                  </p>
                  <Button
                    size={"sm"}
                    type="button"
                    onClick={() =>
                      append({
                        vgrp_id: genId("vgrp"),
                        name: "",
                        options: [],
                      })
                    }
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {`Add Group`}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {fields.map((item, index) => (
                  <div
                    className="grid grid-cols-2 gap-4 py-2 border-b relative"
                    key={item.id}
                  >
                    {/* {ids.find((id) => id === item.vgrp_id) ? (
                      <div className="absolute inset-0 z-40 flex items-center">
                        <div className="bg-background opacity-80 grow h-full" />
                        <div className="bg-background h-full flex items-center">
                          <Button
                            size={"sm"}
                            // className="align-middle"
                            variant={"outline"}
                            onClick={() =>
                              setIds((prev) => [
                                ...prev.filter((id) => id !== item.vgrp_id),
                              ])
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : null} */}
                    <div className="grid gap-2">
                      <FormField
                        key={item.id}
                        control={form.control}
                        name={`groups.${index}.name`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>Group</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Group (required)"
                                {...field}
                              />
                            </FormControl>
                            {form.formState.errors.groups?.message &&
                              fields.some(
                                (item2, index2) =>
                                  item.name === item2.name && index2 !== index
                              ) && (
                                <p className="text-sm font-medium text-destructive">
                                  {form.formState.errors.groups?.message}
                                </p>
                              )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2" key={item.id}>
                      <div className="space-y-2">
                        <span className="text-sm font-medium leading-none">
                          Options
                        </span>
                        <div className="flex w-full space-x-2">
                          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow">
                            {/* {form
                            .getValues(`groups.${index}.options`)
                            ?.map((option) => (
                              <Badge>{option.name}</Badge>
                            ))} */}
                            <InputEnter control={form.control} index={index} />

                            {/* <FormField
                            key={item.id}
                            control={form.control}
                            name={`groups.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <input
                                    className="outline-none w-full"
                                    placeholder="Group (required)"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          /> */}
                          </div>
                          <Button
                            className="grow-0 shrink-0"
                            size={"icon"}
                            onClick={() => {
                              remove(index);
                              //   if (!item.vgrp_id) {
                              //   } else {
                              //     setIds((prev) => [...prev, item.vgrp_id!]);
                              //   }
                            }}
                          >
                            <Trash className="h-4 w-4 " />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  // <input
                  //   key={item.id}
                  //   // {...form.register(`names.${index}.name`)}
                  //   {...form.register(`groups.${index}.name`)}
                  //   defaultValue={item.name}
                  // />
                ))}
              </CardContent>
              <CardFooter className="">
                {/* <div className="space-x-3 ml-auto">
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
              <CardHeader className="space-y-1 flex justify-between">
                <div className="flex justify-between">
                  <p className="font-semibold tracking-tight text-2xl">
                    Variants
                  </p>
                  <Button
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
                    {`Add Variant`}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {vrntFields.map((field, index) => (
                  <div
                    className="grid grid-cols-4 gap-4 border-b py-2 relative"
                    key={field.id}
                  >
                    {/* {ids.find((id) => id === field.v_id) ? (
                      <div className="absolute inset-0 z-40 flex items-center">
                        <div className="bg-background opacity-80 grow h-full" />
                        <div className="bg-background h-full flex items-center">
                          <Button
                            size={"sm"}
                            // className="align-middle"
                            variant={"outline"}
                            onClick={() =>
                              setIds((prev) => [
                                ...prev.filter((id) => id !== field.v_id),
                              ])
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : null} */}
                    <div className="grid col-span-2 gap-2">
                      <div className="space-y-2">
                        <span className="text-sm font-medium leading-none">
                          Varaint
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
                            <FormLabel>Price Plus</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Price (required)"
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
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input
                                    type={"number"}
                                    placeholder="Quantity optional"
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
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {field.vrnt_id ? (
                              <DropdownMenuItem
                                disabled={form.formState.isDirty}
                                onClick={() => {
                                  openSheetHandler();
                                  if (
                                    data?.variants.some(
                                      (variant) =>
                                        variant.vrnt_id === field.vrnt_id
                                    )
                                  ) {
                                    setIdToUpdate(field.vrnt_id);
                                  }
                                }}
                              >
                                Advanced
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
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
                {/* {fields.map((item, index) => (
              <div className="grid grid-cols-2 gap-4" key={item.id}>
                <div className="grid gap-2">
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`groups.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Group (required)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2" key={item.id}>
                  <div className="space-y-2">
                    <span className="text-sm font-medium leading-none">
                      Options
                    </span>
                    <div className="flex w-full space-x-2">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow">
                 
                      

          
                      </div>
                      <Button size={"icon"} onClick={() => remove(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
  
            ))} */}
              </CardContent>
              <CardFooter>
                <div className="space-x-3 ml-auto">
                  {form.formState.isDirty ? (
                    <Button
                      type="button"
                      className=""
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
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
        <AdvancedVariantForm
          // data={dataQuery.data?.data ?? defaultData}
          id={idToUpdate}
          openHandler={openSheetHandlerParam}
          open={open}
        />
        {/* <VariantsForm /> */}
      </div>
    </div>
  );
};

export default VariantAllForm;
