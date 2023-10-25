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
import useGroupsEditFormHook from "./use-groups-edit-form-hook";
import { Pencil, Trash, X } from "lucide-react";
import GroupsDeleteDialog from "../delete/groups-delete-dialog";

interface Props {
  group: IGroup;
  setDelVgrpIdHandler: (data: string | undefined) => void;
  delVgrpId: string | undefined;
}
const GroupsEditForm: FC<Props> = ({
  group,
  delVgrpId,
  setDelVgrpIdHandler,
}) => {
  const {
    form,
    onSubmit,
    checkKeyDown,
    useInitForm,
    toggleEdit,
    isEdit,
    cancelForm,
  } = useGroupsEditFormHook();
  useInitForm(group);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => checkKeyDown(e)}
      >
        <div className="grid grid-cols-2 gap-4 py-2 border-b relative">
          <div className="flex flex-col space-y-2 col-span-2 md:col-span-1">
            <FormField
              control={form.control}
              name={`name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>กลุ่มสินค้า</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEdit}
                      placeholder="ชื่อกลุ่มสินค้า (ต้องกรอก)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col space-y-2 mt-2.5 col-span-2 md:col-span-1">
            <span
              className={`text-sm font-medium leading-none ${
                form.formState.errors.options?.message ? "text-destructive" : ""
              }`}
            >
              ตัวเลือก
            </span>
            <div className="flex w-full space-x-2">
              <div className="flex flex-col w-full">
                <div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2 pt-2.5 flex gap-1 flex-wrap grow">
                    <OptionsInput control={form.control} isEdit={isEdit} />
                  </div>
                </div>
                <p className="text-sm font-medium text-destructive mt-2">
                  {form.formState.errors.options?.message}
                </p>
              </div>
              <div className="flex gap-2 flex-col sm:flex-row">
                {isEdit ? (
                  <>
                    <Button type="submit">ยืนยัน</Button>
                    <Button
                      type="button"
                      className="grow-0 shrink-0"
                      size={"icon"}
                      onClick={() => cancelForm(group)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <GroupsDeleteDialog vgrpId={group.vgrp_id} />
                    <Button
                      onClick={toggleEdit}
                      type="button"
                      className="grow-0 shrink-0"
                      size={"icon"}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default GroupsEditForm;
