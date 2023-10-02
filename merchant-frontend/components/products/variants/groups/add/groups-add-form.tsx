import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { FC } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import OptionsInput from "../options/options-input";
import useGroupsFormHook from "../use-groups-form-hook";
import useGroupsAddForm from "./use-groups-add-form";


const GroupsAddForm= () => {
 // const { form, onSubmit, checkKeyDown } = useGroupsFormHook();
 const {form,onSubmit,checkKeyDown} = useGroupsAddForm()
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name={`name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>กลุ่มสินค้า</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ชื่อกลุ่มสินค้า (ต้องกรอก)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col space-y-2 mt-2.5">
            <span
              className={`text-sm font-medium leading-none ${
                form.formState.errors.options?.message ? "text-destructive" : ""
              }`}
            >
              ตัวเลือก
            </span>
            <div className="flex w-full space-x-2">
              <div className="flex flex-col w-full">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 pt-2.5 flex gap-1 flex-wrap grow">
                  <OptionsInput control={form.control} />
                </div>
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.options?.message}
                </p>
              </div>
              <Button type="submit">ยืนยัน</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default GroupsAddForm;
