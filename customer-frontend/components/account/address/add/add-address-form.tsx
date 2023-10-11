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
import { Textarea } from "../../../ui/textarea";
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
import useAddAddressHook from "./use-add-address-hook";
import { Loader2 } from "lucide-react";
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
  const { addressLoading, form, onSubmit, onOpenChange, open } =
    useAddAddressHook();
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     address: '',
  //     post_code: '',
  //     recipient: '',
  //     tel_number: ''
  //   }
  // });
  // const addresMutate = useCreateAddress();
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  //   addresMutate.mutate(values);
  //   // signinHandler(values);
  // }
  // useEffect(() => {
  //   if (addresMutate.isSuccess) {
  //     form.reset({
  //       address: '',
  //       post_code: '',
  //       recipient: '',
  //       tel_number: ''
  //     });
  //   }
  // }, [addresMutate.isSuccess]);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <DialogTrigger asChild>
        {children ? children : <Button variant="outline">เพิ่มที่อยู่</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>จัดการที่อยู่</DialogTitle>
          <DialogDescription>
            ทําการเพิ่มที่อยู่ของคุณที่นี่ คลิกบันทึกเมื่อคุณทําเสร็จแล้ว
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
                      <FormLabel className="text-right">ผู้รับ</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          // disabled={isLoading}
                          placeholder="ผู้รับ (ต้องกรอก)"
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
                      <FormLabel className="text-right">โทรศัพท์</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          // disabled={isLoading}
                          placeholder="เบอร์โทร (ต้องกรอก)"
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
                      <FormLabel className="text-right">
                        รายละเอียดที่อยู่
                      </FormLabel>
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
                      <FormLabel className="text-right">รหัสไปรษณีย์</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          // disabled={isLoading}
                          placeholder="เลขรหัสไปรษณีย์ (ต้องกรอก)"
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
              <Button type="submit" disabled={addressLoading}>
                {addressLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : undefined}
                บันทึก
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
