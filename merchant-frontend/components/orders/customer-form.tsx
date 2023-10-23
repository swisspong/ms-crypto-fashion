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
import { Textarea } from "../ui/textarea";

interface Props {
  //   openHandler: (open: boolean) => void;
  //   open: boolean;
  //   id: number;
}
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z
    .string()
    .min(10, { message: "Phone must be at least 10 characters." }),
  email: z.string().email(),
});
const name = "provider";
const CustomerForm: FC<Props> = ({}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const [open, setOpen] = useState(false);
  const openHandler = (con: boolean) => {
    // if (!con) {
    //   setIdHandler(undefined);
    // }
    setOpen(con);
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
        <Button size={"sm"}>Update</Button>
      </SheetTrigger>
      <SheetContent position={"right"} size="content" className="p-0">
        <ScrollArea className="h-full w-full rounded-md border p-6">
          <SheetHeader className="pb-4">
            <SheetTitle>Customer</SheetTitle>
            <SheetDescription>
              {`Make changes to your ${name} here. Click save when you're done.`}
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-1"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Recipient name (required)"
                        {...field}
                        //   disabled={addLoading || updateLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email (required)"
                        {...field}
                        //   disabled={addLoading || updateLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone number (required)"
                        {...field}
                        //   disabled={addLoading || updateLoading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

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
                {/* {addLoading || updateLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null} */}
                Save Changes
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerForm;
