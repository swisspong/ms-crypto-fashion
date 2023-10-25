import React, { FC, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, Control } from "react-hook-form";
import { Button } from "../ui/button";
import { MoreHorizontal, PlusCircle, Trash, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Options from "./options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import AdvancedVariantForm from "./advanced-variant-form";
const groups = [
  {
    vrnt_id: "vrnt_1",
    name: "size",
    options: [
      { optn_id: "optn_1", name: "small" },
      { optn_id: "optn_2", name: "medium" },
    ],
  },
  {
    vrnt_id: "vrnt_2",
    name: "color",
    options: [
      { optn_id: "optn_3", name: "Red" },
      { optn_id: "optn_4", name: "Blue" },
    ],
  },
];
interface SelectProps {
  control: Control<
    {
      variants: {
        variant: {
          vrnt_id: string;
          optn_id: string;
        }[];
        price: number;
      }[];
      //   price: number;
    },
    any
  >;
  variants: {
    variant: {
      vrnt_id: string;
      optn_id: string;
    }[];
    price: number;
    quantity?: number | undefined;
  }[];
  index: number;
}
const SelectList: FC<SelectProps> = ({ control, index, variants }) => {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `variants.${index}.variant`,
  });
  return (
    <>
      {fields.map((fieldItem, index2) => (
        <Options
          key={index2}
          group={groups.find((group) => group.vrnt_id === fieldItem.vrnt_id)}
          index={index}
          variants={variants}
          control={control}
          index2={index2}
          groups={groups}
        />
      ))}
    </>
  );
};

const formSchema = z.object({
  variants: z.array(
    z.object({
      v_id: z.string().optional(),
      variant: z.array(
        z.object({ vrnt_id: z.string(), optn_id: z.string().trim().min(2) })
      ),
      price: z.number().min(0),
      quantity: z.number().optional(),
    })
  ),
  //   price: z.number().min(0),
  //   groups: z
  //     .array(
  //       z.object({
  //         group_name: z.string(),
  //         options: z.array(z.object({ name: z.string() })),
  //       })
  //     )
  //     //superRefine
  //     .refine((val) => {
  //       return val.find((item, index) =>
  //         val.find(
  //           (item2, index2) =>
  //             item.group_name === item2.group_name && index !== index2
  //         )
  //       )
  //         ? false
  //         : true;
  //     }),
});
const VariantsForm = () => {
  const [ids, setIds] = useState<string[]>([]);
  const [idToUpdate, setIdToUpdate] = useState<number>(-1);
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variants: [
        {
          variant: [
            {
              vrnt_id: "vrnt_1",
              optn_id: "optn_1",
            },
            {
              vrnt_id: "vrnt_2",
              optn_id: "optn_3",
            },
          ],
          price: 10,
          v_id: "test",
        },
      ],
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  const allowOnlyNumber = (value: any) => {
    if (Number(value) <= 0) {
      return 0;
    }

    return value;
  };
  const openSheetHandler = () => {
    setOpen((prev) => !prev);
  };

  const openSheetHandlerParam = (con: boolean) => {
    if (!con) {
      setIdToUpdate(-1);
    }
    setOpen(con);
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="space-y-1 flex justify-between">
              <div className="flex justify-between">
                <p className="font-semibold tracking-tight text-2xl">
                  Variants
                </p>
                <Button
                  size={"sm"}
                  type="button"
                  onClick={() =>
                    append({
                      price: 0,
                      variant: groups.map((group) => ({
                        vrnt_id: group.vrnt_id,
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
              {fields.map((field, index) => (
                <div
                  className="grid grid-cols-4 gap-4 border-b py-2 relative"
                  key={field.id}
                >
                  {ids.find((id) => id === field.v_id) ? (
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
                  ) : null}
                  <div className="grid col-span-2 gap-2">
                    <div className="space-y-2">
                      <span className="text-sm font-medium leading-none">
                        Varaint
                      </span>
                      <div className="flex w-full space-x-2">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex gap-1 flex-wrap grow">
                          <SelectList
                            control={form.control}
                            index={index}
                            variants={form.getValues("variants")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.price`}
                      //name={`groups.${index}.group_name`}
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
                          name={`variants.${index}.quantity`}
                          //name={`groups.${index}.group_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Quantity optional"
                                  {...field}
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
                          {field.v_id ? (
                            <DropdownMenuItem onClick={openSheetHandler}>
                              Advanced
                            </DropdownMenuItem>
                          ) : null}

                          <DropdownMenuItem
                            onClick={() => {
                              if (!field.v_id) {
                                remove(index);
                              } else {
                                setIds((prev) => [...prev, field.v_id!]);
                              }
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
                    name={`groups.${index}.group_name`}
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
      {/* <AdvancedVariantForm
        // data={dataQuery.data?.data ?? defaultData}
        id={idToUpdate}
        openHandler={openSheetHandlerParam}
        open={open}
      /> */}
    </>
  );
};

export default VariantsForm;
