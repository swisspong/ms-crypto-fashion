import { zodResolver } from "@hookform/resolvers/zod";
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
import { usePaymentReport } from "@/src/hooks/payment/queries";
import { useWithdraw } from "@/src/hooks/payment/mutations";
import { useGetMerchantCredential } from "@/src/hooks/merchant/queries";
const formSchema = z.object({
  amount: z
    .number()
    .int()
    .min(50, { message: "ต้องมากกว่าหรือเท่ากับ 100 บาท" }),
});
interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const WithdrawForm: FC<Props> = ({ setOpen }) => {
  const paymentReportQuery = usePaymentReport();
  const credentialQuery = useGetMerchantCredential();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50,
    },
  });
  const withdraw = useWithdraw();
  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
    if (credentialQuery.data?.recp_id)
      withdraw.mutate({
        amount: values.amount,
        recp_id: credentialQuery.data.recp_id,
      });
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
              name="amount"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">จำนวน</FormLabel>
                  <div className="w-full col-span-3">
                    <FormControl className="">
                      <Input
                        type="number"
                        placeholder="amount (required)"
                        //disabled={isLoading}

                        {...field}
                        max={
                          paymentReportQuery.data?.data.amountCreditCanWithdraw
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

export default WithdrawForm;
