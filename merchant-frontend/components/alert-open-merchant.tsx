import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
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
import { useRouter } from "next/router";
import { useUserInfo } from "@/src/hooks/user/queries";
import { RoleFormat } from "@/src/types/user";
import { Loader2 } from "lucide-react";
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
import { useStartMerchant } from "@/src/hooks/merchant/mutations";
const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Shop name must be at least 2 characters." }),

  banner_title: z
    .string()
    .min(4, { message: "Shop title must be at least 4 characters." }),
});
const AlertOpentMerchant = () => {
  const router = useRouter();
  const { data, isSuccess } = useUserInfo();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const {
    mutate: openHandler,
    isLoading,
    isSuccess: openSuccess,
  } = useStartMerchant();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    openHandler(values);
  }
  useEffect(() => {
    if (isSuccess) {
      if (data.role === RoleFormat.USER) {
        setOpen(true);
      }
    }
  }, [isSuccess]);
  useEffect(() => {
    if (openSuccess) {
      setOpen(false);
    }
  }, [openSuccess]);
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เริ่มเปิดร้านค้า</DialogTitle>
          <DialogDescription>
            เริ่มเปิดร้านเพื่อสร้างสรรค์สินค้า ถ้าพร้อมขายแล้วต้องจ่ายรายเดือน
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ร้านค้า</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="ชื่อร้านค้า (ต้องกรอก)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="banner_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>สโลแกน</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="บรรยายร้านค้าของคุณให้เรารู้ (ต้องกรอก)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => router.back()}
              >
                ยกเลิก
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                บันทึก
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AlertOpentMerchant;
