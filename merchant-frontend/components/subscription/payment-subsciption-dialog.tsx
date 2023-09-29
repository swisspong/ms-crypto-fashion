import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateToken, useCreditCard } from "@/src/hooks/payment/mutations";
import { useRouter } from "next/router";

const formSchema = z.object({
  name: z.string().trim().min(5, { message: "name card must be at least 5 characters." }),
  number: z.string().max(16, { message: "number card must be at most 16 number." }),
  expiration_month: z.string().trim(),
  expiration_year: z.string().trim(),
  security_code: z.string().trim().min(3, { message: "least 1 number." })
})

const PaymentSubscriptionDialog = () => {

  const router = useRouter()

  const { mutateAsync: tokenHandler, isLoading: tokenLoading, isSuccess: tokenSuccess } = useCreateToken()
  const { mutate: creditHandler, isLoading, isSuccess } = useCreditCard()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      number: "",
      security_code: "",
      expiration_month: undefined,
      expiration_year: undefined
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const omise: ICreateOmiseToken = {
      card: {
        ...values,
        expiration_month: parseInt(values.expiration_month),
        expiration_year: parseInt(values.expiration_year)
      }
    }
    const token = await tokenHandler(omise)
    console.log(token)

    const body: ICreateCreditCard = {
      amount_: 300,
      token: token.id
    }

    creditHandler(body)

  }

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">ชำระเงิน ฿300.00</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>วิธีการชำระเงิน</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลเพื่อชำระเงินของคุณ กดบันทึกเมื่อกรอกเสร็จสิ้นแล้ว
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="card" id="card" className="sr-only" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="mb-3 h-6 w-6"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
              Card
            </Label>
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="paypal" id="paypal" className="sr-only" />
              <Icons.paypal className="mb-3 h-6 w-6" />
              Paypal
            </Label>
            <Label
              htmlFor="apple"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="apple" id="apple" className="sr-only" />
              <Icons.apple className="mb-3 h-6 w-6" />
              Apple
            </Label>
          </RadioGroup>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="p-2">
                    <FormLabel>ชื่อ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ชื่อภายในบัตร (ต้องกรอก)"
                        disabled={isLoading || tokenLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="p-2">
                    <FormLabel>หมายเลขบัตร</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        disabled={isLoading || tokenLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="p-2 grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiration_month"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>เดือนหมดอายุบัตร</FormLabel>
                      <Select disabled={isLoading || tokenLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="month">
                            <SelectValue placeholder="เลือกเดือน" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">มกราคม(1)</SelectItem>
                          <SelectItem value="2">กุมภาพันธ์ (2)</SelectItem>
                          <SelectItem value="3">มีนาคม(3)</SelectItem>
                          <SelectItem value="4">เมษายน(4)</SelectItem>
                          <SelectItem value="5">พฤษภาคม(5)</SelectItem>
                          <SelectItem value="6">มิถุนายน (6)</SelectItem>
                          <SelectItem value="7">กรกฎาคม (7)</SelectItem>
                          <SelectItem value="8">สิงหาคม(8)</SelectItem>
                          <SelectItem value="9">กันยายน(9)</SelectItem>
                          <SelectItem value="10">ตุลาคม (10)</SelectItem>
                          <SelectItem value="11">พฤศจิกายน (11)</SelectItem>
                          <SelectItem value="12">ธันวาคม(12)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiration_year"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>ปีหมดอายุบัตร</FormLabel>
                      <Select disabled={isLoading || tokenLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="year">
                            <SelectValue placeholder="เลือกปี" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const currentYear = new Date().getFullYear() + i;
                            const buddhistYear = currentYear + 543; // แปลงเป็นพ.ศ.

                            return (
                              <SelectItem key={i} value={`${currentYear}`}>
                                {`${buddhistYear} / ${currentYear}`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />



              </div>
              <div className="p-2">
                <FormField
                  control={form.control}
                  name="security_code"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="CVC"
                          disabled={isLoading || tokenLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-2">
                <Button className="w-full font-bold" disabled={isLoading || tokenLoading}>
                  {isLoading || tokenLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  ชำระเงิน
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSubscriptionDialog;
