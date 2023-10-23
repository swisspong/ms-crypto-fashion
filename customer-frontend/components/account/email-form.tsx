import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useChangeEmail } from "@/src/hooks/user/mutations";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { StatusFormat } from "@/src/types/enums/common";

const emailFormSchema = z.object({
    email: z
        .string({ required_error: "ต้องกรอก" })
        .email({ message: "อีเมลไม่ถูกต้อง" })
        .trim(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<EmailFormValues> = {

};

export function EmailForm() {
    const { mutateAsync: handleEmail, isSuccess, isLoading } = useChangeEmail()

    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailFormSchema),
        defaultValues,
        mode: "onChange",
    });

    async function onSubmit(data: EmailFormValues) {
        const result = await handleEmail(data)
        if (result.status === StatusFormat.SUCCESS) {
            toast.success('ส่งข้อมูลสำเร็จ กรุณาตรวจสอบอีเมล')
        } else {
            toast('เกิดข้อผิดพลาด อีเมลนี้ถูกใช้ไปแล้ว')
        }
    }

    useEffect(() => {
        if (isSuccess) {
            form.reset({
                email: ""
            })

            
            
        }
    }, [isSuccess])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
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
                <Button disabled={isLoading} type="submit">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    เปลี่ยนแปลงอีเมล
                </Button>
            </form>
        </Form>
    )
}