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
import { useCheckoutOrdering } from "@/src/hooks/checkout/mutations";
interface Props {
  data?: ICheckoutResponse;
  address: IAddress | undefined;
}

const formSchema = z.object({
  name: z
    .string({ required_error: "ต้องกรอก" })
    .trim()
    // .min(5, { message: "name card must be at least 5 characters." }),
    .min(5, { message: "ชื่อต้องมีอย่างน้อย 5 ตัวอักษร" }),
  number: z
    .string({ required_error: "ต้องกรอก" })
    .max(16, { message: "หมายเลขบัตรต้องมี 16 หมายเลข" })
    .min(16, { message: "หมายเลขบัตรต้องมี 16 หมายเลข" }),
  expiration_month: z.string({ required_error: "ต้องเลือก" }).trim(),
  expiration_year: z.string({ required_error: "ต้องเลือก" }).trim(),
  security_code: z
    .string()
    .trim()
    .min(3, { message: "ต้องมีอย่างน้อย 3 หมายเลข" }),
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
  const checkoutOrderMutate = useCheckoutOrdering();
  useEffect(() => {
    if (checkoutOrderMutate.isSuccess) {
      if (checkoutOrderMutate.data.chkt) {
      } else {
        router.replace("/account/orders");
      }
    }
  }, [checkoutOrderMutate.isSuccess]);
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
      checkoutOrderMutate.mutate({
        chktId: data.chkt_id,
        body: {
          address: address?.address,
          chkt_id: data.chkt_id,
          post_code: address?.post_code,
          recipient: address?.recipient,
          tel_number: address?.tel_number,
          token: token.id,
          payment_method: "credit",
        },
      });
    }
    // creditHandler(body)
  }
  return data?.payment_method &&
    data?.payment_method === PaymentMethodFormat.WALLET ? (
    <MetamaskPayment data={data} address={address} />
  ) : (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>วิธีการชำระเงิน</CardTitle>
        <CardDescription>เลือกวิธีการชำระเงินของคุณ</CardDescription>
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
                    <FormLabel>ชื่อ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ชื่อภายในบัตร (ต้องกรอก)"
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
                    <FormLabel>หมายเลขบัตร</FormLabel>
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
                    <FormItem className="grid gap-2">
                      <FormLabel>เดือนหมดอายุบัตร</FormLabel>
                      <Select
                        disabled={tokenLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="expiration_year"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>ปีหมดอายุบัตร</FormLabel>
                      <Select
                        disabled={tokenLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
              ดำเนินการต่อ
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
