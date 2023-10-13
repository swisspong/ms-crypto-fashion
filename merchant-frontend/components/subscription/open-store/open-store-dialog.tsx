import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import FileUploadOne from "../../file-upload-one";

import useOpenStoreHook from "./use-open-store-hook";
import { Loader2 } from "lucide-react";
const OpenStoreDialog = () => {
  const { form, loading, onSubmit, success } = useOpenStoreHook();
  return (
    <>
      {!success && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">เปิดร้าน</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>คำร้องเปิดร้านค้า</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลรับรองตัวตนเพื่อยืนยันร้านค้า
                กดบันทึกเมื่อกรอกข้อมูลเสร็จสิ้น
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ชื่อ</FormLabel>
                          <FormControl>
                            <Input placeholder="ชื่อ (ต้องกรอก)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>นามสกุล</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="นามสกุล (ต้องกรอก)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid  col-span-2 gap-4">
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รูปบัตรประจำตัวประชาชน</FormLabel>
                          <FormControl>
                            <FileUploadOne
                              onChange={field.onChange}
                              image_url={field.value}
                              //   remove={imageRemove}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : undefined}
                    บันทึก
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default OpenStoreDialog;
