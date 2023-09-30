import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { usePaymentReport } from "@/src/hooks/payment/queries";
import { useWithdraw, useWithdrawEth } from "@/src/hooks/payment/mutations";
import { useGetMerchantCredential } from "@/src/hooks/merchant/queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const formSchema = z.object({
  amount: z.number(),
  address: z.string(),
});
interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const WithdrawMetamaskForm: FC<Props> = ({ setOpen }) => {
  const paymentReportQuery = usePaymentReport();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const withdraw = useWithdrawEth();
  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);

    withdraw.mutate(values);
  }
  const allowOnlyNumber = (value: any) => {
    if (Number(value) <= 0) {
      return 0;
    }
    return value;
  };

  useEffect(() => {
    if (withdraw.isSuccess) {
      setOpen(false);
    }
  }, [withdraw.isSuccess]);
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid gap-4 py-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">ที่อยู่ wallet</FormLabel>
                  <div className="w-full col-span-3">
                    <FormControl className="">
                      <Input
                        type="text"
                        placeholder="ที่อยู่ wallet (ต้องกรอก)"
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
              name="amount"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">จำนวน</FormLabel>
                  <div className="w-full col-span-3">
                    <FormControl className="">
                      <Input
                        type="number"
                        placeholder="จำนวน (ต้องกรอก)"
                        //disabled={isLoading}

                        {...field}
                        max={
                          paymentReportQuery.data?.data.amountEthCanWithdraw
                        }
                        onChange={(e) =>
                          field.onChange(
                            Number(allowOnlyNumber(e.target.value))
                          )
                        }
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
            <Button type="submit" disabled={withdraw.isLoading}>
              ยืนยัน
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default WithdrawMetamaskForm;
