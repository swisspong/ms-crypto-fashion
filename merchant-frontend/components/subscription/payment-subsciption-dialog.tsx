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
        <Button className="w-full">Pay ฿300.00</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment method</DialogTitle>
          <DialogDescription>
            Make changes to your payment here. Click save when you're done.
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="First Last"
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
                    <FormLabel>Card Number</FormLabel>
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
              <div className="p-2 grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="expiration_month"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Month</FormLabel>
                      <Select disabled={isLoading || tokenLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="month">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">January(1)</SelectItem>
                          <SelectItem value="2">February(2)</SelectItem>
                          <SelectItem value="3">March(3)</SelectItem>
                          <SelectItem value="4">April(4)</SelectItem>
                          <SelectItem value="5">May(5)</SelectItem>
                          <SelectItem value="6">June(6)</SelectItem>
                          <SelectItem value="7">July(7)</SelectItem>
                          <SelectItem value="8">August(8)</SelectItem>
                          <SelectItem value="9">September(9)</SelectItem>
                          <SelectItem value="10">October(10)</SelectItem>
                          <SelectItem value="11">November(11)</SelectItem>
                          <SelectItem value="12">December(12)</SelectItem>
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
                      <FormLabel>Year</FormLabel>
                      <Select disabled={isLoading || tokenLoading} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="year">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 15 }, (_, i) => (
                            <SelectItem
                              key={i}
                              value={`${new Date().getFullYear() + i}`}
                            >
                              {new Date().getFullYear() + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  Save Changes
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
