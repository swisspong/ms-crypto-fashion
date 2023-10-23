"use client";
import React, { useState } from "react";
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
import { PlusCircle, Trash, X } from "lucide-react";
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
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import InputEnter from "../input-enter";
import VariantsForm from "./variants-form";
const formSchema = z.object({
  groups: z
    .array(
      z.object({
        g_id: z.string().optional(),
        group_name: z.string(),
        options: z.array(z.object({ name: z.string() })),
      })
    )
    //superRefine
    .refine((val) => {
      return val.find((item, index) =>
        val.find(
          (item2, index2) =>
            item.group_name === item2.group_name && index !== index2
        )
      )
        ? false
        : true;
    }),
});
const VariantForm = () => {
  const [ids, setIds] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // groups: [
      //   {
      //     g_id: "fds",
      //     group_name: "Size",
      //     options: [
      //       {
      //         name: "Small",
      //       },
      //     ],
      //   },
      // ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "groups",
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
  }
  const allowOnlyNumber = (value: any) => {
    if (Number(value) <= 0) {
      return 0;
    }

    return value;
  };

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
                        group_name: "",
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
                    {ids.find((id) => id === item.g_id) ? (
                      <div className="absolute inset-0 z-40 flex items-center">
                        <div className="bg-background opacity-80 grow h-full" />
                        <div className="bg-background h-full flex items-center">
                          <Button
                            size={"sm"}
                            // className="align-middle"
                            variant={"outline"}
                            onClick={() =>
                              setIds((prev) => [
                                ...prev.filter((id) => id !== item.g_id),
                              ])
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : null}
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
                            {/* {form
                            .getValues(`groups.${index}.options`)
                            ?.map((option) => (
                              <Badge>{option.name}</Badge>
                            ))} */}
                            <InputEnter control={form.control} index={index} />

                            {/* <FormField
                            key={item.id}
                            control={form.control}
                            name={`groups.${index}.group_name`}
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
                              if (!item.g_id) {
                                remove(index);
                              } else {
                                setIds((prev) => [...prev, item.g_id!]);
                              }
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
                  //   {...form.register(`groups.${index}.group_name`)}
                  //   defaultValue={item.group_name}
                  // />
                ))}
              </CardContent>
              <CardFooter className="">
                <div className="space-x-3 ml-auto">
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
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
        <VariantsForm />
      </div>
    </div>
  );
};

export default VariantForm;
