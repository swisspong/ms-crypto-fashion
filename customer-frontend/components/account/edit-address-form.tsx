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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { formSchema } from "./address/add/add-address-helper";
import { Loader2 } from "lucide-react";

interface Props {
  data: IAddress;
  open: boolean;
  isLoading: boolean;
  isSuccess: boolean;

  updateHandler: (body: { id: string; data: IAddressPayload }) => void;
  openHandler: (open: boolean) => void;
}

// const formSchema = z.object({
//   recipient: z.string().trim(),
//   post_code: z.string().trim(),
//   tel_number: z.string().trim(),
//   address: z.string().trim(),
// });

export function EditAddressForm({
  open,
  openHandler,
  data,
  isLoading,
  isSuccess,
  updateHandler,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: data?.address,
      post_code: data?.post_code,
      recipient: data?.recipient,
      tel_number: data?.tel_number,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    updateHandler({
      id: data?.addr_id,
      data: { ...values },
    });
  }

  // ! Effect reset and close dialog
  useEffect(() => {
    form.reset({
      address: data?.address,
      post_code: data?.post_code,
      recipient: data?.recipient,
      tel_number: data?.tel_number,
    });
  }, [data, open]);

  useEffect(() => {
    openHandler(false);
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={(e) => openHandler(e)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขที่อยู่</DialogTitle>
          <DialogDescription>
            ทําการเปลี่ยนแปลงที่อยู่ของคุณที่นี่ คลิกบันทึกเมื่อคุณทําเสร็จแล้ว
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
                      <div className="col-span-3">
                        <FormControl>
                          <Input
                            // className="col-span-3"
                            // disabled={isLoading}
                            placeholder="ผู้รับ (ต้องกรอก)"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
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
                      <div className="col-span-3">
                        <FormControl>
                          <Input
                            // className="col-span-3"
                            // disabled={isLoading}
                            placeholder="เบอร์โทร (ต้องกรอก)"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
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
                      <div className="col-span-3">
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </div>
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
                      <div className="col-span-3">
                        <FormControl>
                          <Input
                            // disabled={isLoading}
                            placeholder="เลขรหัสไปรษณีย์ (ต้องกรอก)"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : undefined}
                บันทึกการเปลี่ยนแปลง
              </Button>
            </DialogFooter>
          </form>
          {/* <form onSubmit={form.handleSubmit(onSubmit)}>
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
                          {...field}
                          className="col-span-3"
                          // disabled={isLoading}
                          placeholder="ชื่อผู้รับ"
                          type="text"
                          disabled={isLoading}
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
                          placeholder="เบอร์โทร"
                          type="tel"
                          {...field}
                          disabled={isLoading}
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
                        <Textarea
                          className="col-span-3"
                          {...field}
                          disabled={isLoading}
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
                  name="post_code"
                  render={({ field }) => (
                    <FormItem className="w-full grid grid-cols-4 items-center  gap-4">
                      <FormLabel className="text-right">รหัสไปรษณีย์</FormLabel>
                      <FormControl>
                        <Input
                          className="col-span-3"
                          placeholder="เลขรหัสไปรษณีย์"
                          type="text"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isLoading} type="submit">
                บันทึกการเปลี่ยนแปลง
              </Button>
            </DialogFooter>
          </form> */}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
