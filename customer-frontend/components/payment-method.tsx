import { FC, useEffect } from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCreateOrder } from "@/src/hooks/order/mutations";
import { useRouter } from "next/router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useCreateToken } from "@/src/hooks/payment/mutations";
import { PaymentMethodFormat } from "@/src/types/enums/product";
import MetamaskPayment from "./payment/metamask-payment";
interface Props {
  data?: ICheckout;
  address: IAddress | undefined;
}

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "name card must be at least 5 characters." }),
  number: z
    .string()
    .max(16, { message: "number card must be at most 16 number." }),
  expiration_month: z.string().trim(),
  expiration_year: z.string().trim(),
  security_code: z.string().trim().min(3, { message: "least 1 number." }),
});

export function PaymentMethod({ data, address }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      number: "",
      security_code: "",
      expiration_month: undefined,
      expiration_year: undefined,
    },
  });
  const router = useRouter();
  const orderMutate = useCreateOrder();
  useEffect(() => {
    if (orderMutate.isSuccess) {
      router.replace("/account/orders");
    }
  }, [orderMutate.isSuccess]);
  const {
    mutateAsync: tokenHandler,
    isLoading: tokenLoading,
    isSuccess: tokenSuccess,
  } = useCreateToken();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const omise: ICreateOmiseToken = {
      card: {
        ...values,
        expiration_month: parseInt(values.expiration_month),
        expiration_year: parseInt(values.expiration_year),
      },
    };
    const token = await tokenHandler(omise);
    // const body: ICreateCreditCard = {
    //   amount_: 300,
    //   token: token.id
    // }

    if (address && data?.chkt_id) {
      console.log(address, data.chkt_id);
      orderMutate.mutate({
        address: address?.address,
        chkt_id: data.chkt_id,
        post_code: address?.post_code,
        recipient: address?.recipient,
        tel_number: address?.tel_number,
        token: token.id,
        payment_method: "credit",
      });
    }
    // creditHandler(body)
  }
  return data?.payment_method &&
    data?.payment_method === PaymentMethodFormat.WALLET ? (
    <MetamaskPayment data={data} address={address}/>
  ) : (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Add a new payment method to your account.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <RadioGroup
              defaultValue={data?.payment_method}
              value={data?.payment_method}
              className="grid grid-cols-3 gap-4"
            >
              <Label
                htmlFor="credit"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  value="credit"
                  id="credit"
                  className="sr-only"
                  disabled={true}
                />
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
                htmlFor="wallet"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem
                  value="wallet"
                  id="wallet"
                  className="sr-only"
                  disabled={true}
                />
                <Icons.metamask className="mb-3 h-6 w-6" />
                Metamask
              </Label>
            </RadioGroup>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Name"
                        disabled={tokenLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="First Last" /> */}
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        disabled={tokenLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="expiration_month"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Expires</FormLabel>
                      <Select
                        disabled={tokenLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="expiration_year"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Year</FormLabel>
                      <Select
                        disabled={tokenLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="security_code"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="CVC"
                          disabled={tokenLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={data?.items.some((item) => item.message) || !address}
            >
              Continue
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
