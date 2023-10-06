"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useUserInfo } from "@/src/hooks/user/queries";
import { Log } from "ethers";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateProfile } from "@/src/hooks/user/mutations";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    })
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;





export function ProfileForm() {

  const {
    data: me,
    isLoading: meLoading,
    isSuccess: meSuccess,
  } = useUserInfo();

  const { mutate: handleProdile, isSuccess, isLoading } = useUpdateProfile()

  // This can come from your database or API.
  const defaultValues: Partial<ProfileFormValues> = {
    username: me?.username
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (meSuccess) {
      form.reset({
        username: me.username
      })
    }
  }, [meSuccess])


  function onSubmit(data: ProfileFormValues) {
    handleProdile(data)
  }

  useEffect(() => {
    if (isSuccess) toast.success('บันทึกชื่อผู้ใช้สำเร็จ')
  }, [isSuccess])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อผู้ใช้</FormLabel>
              <FormControl>
                <Input placeholder="ชื่อผู้ใช้ที่ต้องการเปลี่ยนแปลง" {...field} />
              </FormControl>
              <FormDescription>
                นี่คือชื่อที่แสดงต่อสาธารณะของคุณ อาจเป็นชื่อจริงหรือนามแฝงของคุณ
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          บันทึกการเปลี่ยนแปลงชื่อผู้ใช้
        </Button>
      </form>
    </Form>


  );
}

{/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>อีเมล</FormLabel>
              <FormControl>
                <Input placeholder="อีเมลที่ต้องการเปลี่ยนแปลง" {...field} />
              </FormControl>
              <FormDescription>
                คุณสามารถจัดการที่อยู่อีเมล
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
