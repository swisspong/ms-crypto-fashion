import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "recharts";
import { useGetRecipient, usePaymentReport } from "@/src/hooks/payment/queries";
import { useWithdraw } from "@/src/hooks/payment/mutations";
import { useGetMerchantCredential } from "@/src/hooks/merchant/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddAccount } from "@/src/hooks/merchant/mutations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bank_account_brand: z.string(),
  bank_account_number: z.string(),
});

const RecipientForm = () => {
  const credentialQuery = useGetMerchantCredential();
  const recipientQuery = useGetRecipient(credentialQuery.data?.recp_id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const addAccount = useAddAccount();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
    addAccount.mutate({
      "bank_account[name]": values.name,
      "bank_account[brand]": values.bank_account_brand,
      "bank_account[number]": values.bank_account_number,
      email: values.email,
      name: values.name,
    });
  }

  useEffect(() => {
    if (addAccount.isSuccess) {
      credentialQuery.refetch();
    }
  }, [addAccount.isSuccess]);
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">ชื่อ</FormLabel>
                  <div className="w-full col-span-3">
                    <FormControl className="">
                      <Input
                        placeholder="ชื่อ (ต้องกรอก)"
                        //disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">อีเมล</FormLabel>
                  <div className="w-full col-span-3">
                    <FormControl className="">
                      <Input
                        placeholder="อีเมล (ต้องกรอก)"
                        //disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bank_account_brand"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">ธนาคาร</FormLabel>
                  <div className="w-full col-span-3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกธนาคาร" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scb">ธนาคารไทยพาณิชย์</SelectItem>
                        <SelectItem value="ktb">ธนาคารกรุงไทย</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bank_account_number"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">เลขบัญชีธนาคาร</FormLabel>
                  <div className="w-full col-span-3">
                    <FormControl className="">
                      <Input
                        placeholder="เลขบัญชีธนาคาร (ต้องกรอก)"
                        //disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {/* <Label htmlFor="name" className="text-right">
              จำนวน
            </Label>
            <Input id="name" defaultValue="100" className="col-span-3" /> */}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={addAccount.isLoading}>
              ยืนยัน
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default RecipientForm;
