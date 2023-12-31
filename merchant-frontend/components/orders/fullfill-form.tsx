import React, { useState, useEffect, FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import * as z from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { Loader2, PlusCircle } from "lucide-react";

// import { ICreateProviderPayload, IProvider } from "@/src/interfaces/provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import FileUpload from "../file-upload";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { useFullfillmentOrder } from "@/src/hooks/order/mutations";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface Props {
  //   openHandler: (open: boolean) => void;
  //   open: boolean;
  //   id: number;
  data: IOrderRow | undefined;
}
const formSchema = z.object({
  shipping_carier: z.string({
    required_error: "Please select an shipping carier to display.",
  }),
  tracking: z.string().trim().min(1),
});
const name = "provider";
const FullfillForm: FC<Props> = ({ data }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const fullfillMutate = useFullfillmentOrder();
  const [open, setOpen] = useState(false);

  const openHandler = (con: boolean) => {
    // if (!con) {
    //   setIdHandler(undefined);
    // }
    if (!fullfillMutate.isLoading) {
      setOpen(con);
    }
  };
  //   useEffect(() => {
  //     if (id > 0) {
  //       const obj = data.find((item) => item.id === id);
  //       if (obj)
  //         form.reset({
  //           code: obj.code,
  //           available: obj.available,
  //           name: obj.name,
  //           price: Number(obj.price),
  //           status: obj.status,
  //           image_url: obj.image_url,
  //         });
  //     }
  //   }, [id]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (id <= 0) addHandler(values);
    // else updateHandler(values);
    fullfillMutate
      .mutateAsync({
        orderId: router.query.orderId as string,
        body: values,
      })
      .then(() => {
        toast.success("บันทึกสำเร็จ!", {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setOpen(false);
      });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        openHandler(open);
        // if (!addLoading && !updateLoading) {
        //   openHandler(open);
        //   form.reset();
        // }
      }}
    >
      <SheetTrigger asChild>
        <Button size={"sm"}>การเตรียมสินค้า</Button>
      </SheetTrigger>
      <SheetContent
        position={"right"}
        size="content"
        className="p-0 lg:w-[800px]"
      >
        <ScrollArea className="h-full w-full rounded-md border p-4">
          <SheetHeader className="pb-4">
            <SheetTitle>การเตรียมสินค้า</SheetTitle>
            <SheetDescription>
              {`จัดเตรียมสินค้า และบันทึกการติดตาม`}
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-1"
            >
              <div className="rounded-md border mb-4">
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">สินค้า</TableHead>
                        {/* <TableHead>QTY</TableHead> */}
                        <TableHead className="text-right">จำนวน</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.items.map((orderItem) => (
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={orderItem.image}
                                  className="object-cover h-14 w-14 rounded-md"
                                />
                                <div>
                                  <div className="text-sm flex space-x-1 items-center mb-1">
                                    <span>{orderItem.name}</span>
                                  </div>
                                  {/* <div className="flex gap-0.5 flex-wrap">
                                  {orderItem.variant.map((variant) => (
                                    <Badge className="text-xs">
                                      {variant.option_name}
                                    </Badge>
                                  ))}
                                </div> */}
                                  <div className="flex">
                                    <div className="flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer">
                                      <span className="flex text-xs font-light items-center whitespace-nowrap sm:text-sm">
                                        ตัวเลือก:
                                      </span>
                                      <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                        {orderItem.variant
                                          .map((optn) => {
                                            return optn.option_name;
                                          })
                                          .join(", ")}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {/* {orderItem.quantity} of {orderItem.quantity} */}
                            {orderItem.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="pt-1 space-y-2">
                  {data?.items.map((orderItem) => (
                    <div className="px-2 mb-1 block md:hidden ">
                      <div className="flex items-center space-x-3">
                        <img
                          src={orderItem.image}
                          className="object-cover h-14 w-14 rounded-md"
                        />
                        <div className="w-full">
                          <p className="line-clamp-1 text-sm mb-1">
                            {orderItem.name}
                          </p>

                          <div className="flex justify-between pb-1 border-b">
                            {orderItem.variant.length > 0 ? (
                              <div
                                className={`flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer`}
                              >
                                <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                  ตัวเลือก:
                                  {orderItem.variant
                                    .map((optn) => {
                                      return optn.option_name;
                                    })
                                    .join(", ")}
                                </p>
                              </div>
                            ) : (
                              <div></div>
                            )}
                            {/* <div
                                  className={`flex space-x-1 px-0.5 bg-muted rounded-sm cursor-pointer`}
                                >
                                  <p className=" text-xs rounded-sm line-clamp-1 sm:text-sm">
                                    ตัวเลือก:
                                    {orderItem.variant
                                      .map((optn) => {
                                        return optn.option_name;
                                      })
                                      .join(", ")}
                                  </p>
                                </div> */}

                            <div className="">
                              <p className="text-xs justify-self-end text-right">
                                x{orderItem.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="shipping_carier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ขนส่ง</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          // disabled={addLoading || updateLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกขนส่ง" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="flash express">
                              Flash express
                            </SelectItem>
                            {/* <SelectItem value="PURCHASED">Purchase</SelectItem> */}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="tracking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>การติดตาม</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="รหัสการติดตาม หรือลิงค์ (ต้องกรอก)"
                            {...field}
                            //   disabled={addLoading || updateLoading}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Code"
                            {...field}
                            //   disabled={addLoading || updateLoading}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
              </div>

              {/* <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUploadHook
                      isLoading={addLoading || updateLoading}
                      onChange={field.onChange}
                      image_url={field.value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}

              <Button
                //   disabled={addLoading || updateLoading}
                type="submit"
                className="w-full"
              >
                {fullfillMutate.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                ยืนยัน
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default FullfillForm;
