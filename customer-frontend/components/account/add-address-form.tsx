import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateAddress } from "@/src/hooks/address/mutations";
import { FC, useEffect } from "react";
const formSchema = z.object({
  recipient: z.string().trim(),
  post_code: z.string().trim(),
  tel_number: z.string().trim(),
  address: z.string().trim(),
});
interface Props {
  children?: JSX.Element | JSX.Element[];
}
export function AddAddressForm({ children }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      post_code: '',
      recipient: '',
      tel_number: ''
    }
  });
  const addresMutate = useCreateAddress();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    addresMutate.mutate(values);
    // signinHandler(values);
  }
  useEffect(() => {
    if (addresMutate.isSuccess) {
      form.reset({
        address: '',
        post_code: '',
        recipient: '',
        tel_number: ''
      });
    }
  }, [addresMutate.isSuccess]);
  return (
    <Dialog
      onOpenChange={(open) => {
        form.reset({});
      }}
    >
      <DialogTrigger asChild>
        {children ? children : <Button variant="outline">Add Address</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Address</DialogTitle>
          <DialogDescription>
            Make changes to your address here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem className="w-full grid grid-cols-4 items-center  gap-4">
                      <FormLabel className="text-right">Recipient</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          // disabled={isLoading}
                          placeholder="Recipient (required)"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="tel_number"
                  render={({ field }) => (
                    <FormItem className="w-full grid grid-cols-4 items-center  gap-4">
                      <FormLabel className="text-right">Tel</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          // disabled={isLoading}
                          placeholder="Tel number (required)"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-full grid grid-cols-4 items-center  gap-4">
                      <FormLabel className="text-right">Address</FormLabel>
                      <FormControl>
                        <Textarea className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="post_code"
                  render={({ field }) => (
                    <FormItem className="w-full grid grid-cols-4 items-center  gap-4">
                      <FormLabel className="text-right">Post code</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          // disabled={isLoading}
                          placeholder="Post code (required)"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
