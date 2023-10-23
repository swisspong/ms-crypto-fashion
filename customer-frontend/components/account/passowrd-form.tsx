import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useChangePassword } from "@/src/hooks/user/mutations";
import { toast } from "react-toastify";
import { StatusFormat } from "@/src/types/enums/common";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Link from "next/link";
const formSchema = z.object({
    old_password: z
        .string({ required_error: "ต้องกรอก" })
        .min(4, { message: "ต้องมีตัวอักษรอย่างน้อย 4 ตัว" })
        .trim(),

    new_password: z
        .string({ required_error: "ต้องกรอก " })
        .min(4, { message: "ต้องมีตัวอักษรอย่างน้อย 4 ตัว" })
        .trim(),

    confirm_password: z
        .string({ required_error: "ต้องกรอก " })
        .min(4, { message: "ต้องมีตัวอักษรอย่างน้อย 4 ตัว" })
        .trim(),
}).superRefine(({ confirm_password, new_password }, ctx) => {
    if (confirm_password !== new_password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "รหัสผ่านไม่ตรงกัน",
            path: ['confirm_password']
        });
    }
});

type PasswordFormValues = z.infer<typeof formSchema>;




export function PasswordForm() {

    const { mutateAsync: handlePass, isSuccess, isLoading } = useChangePassword()
    const defaultValues: Partial<PasswordFormValues> = {};

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: "onChange",
    });

    async function onSubmit(data: PasswordFormValues) {
        const { old_password, new_password } = data
        const obj: IPasswordPayload = {
            new_password,
            old_password
        }

        const result = await handlePass(obj)

        if (result.status === StatusFormat.SUCCESS) {
            toast.success('ส่งข้อมูลสำเร็จ กรุณาตรวจสอบอีเมล')
        } else {
            toast('เกิดข้อผิดพลาด รหัสผ่านไม่ถูกต้อง')
        }

    }

    useEffect(() => {
        if (isSuccess) {
            form.reset({
                confirm_password: "",
                new_password: "",
                old_password: ""
            })
        }
    }, [isSuccess])
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="old_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>รหัสผ่าน</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="กรอกรหัสผ่าน" type="password" />
                            </FormControl>
                            <FormDescription>
                                กรุณากรอกรหัสผ่านปัจจุบันเพื่อเปลี่ยนรหัสใหม่
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>รหัสผ่านใหม่</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isLoading} placeholder="กรอกรหัสผ่าน" type="password" />
                            </FormControl>
                            <FormDescription>
                                กรุณากรอกรหัสผ่านที่ต้องการเปลี่ยน
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ยืนยันรหัสผ่านใหม่</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isLoading} placeholder="กรอกรหัสผ่าน" type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <Button
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading ? (
                            <Loader2 className=" h-4 w-4 animate-spin" />
                        ) : null}
                        เปลี่ยนแปลงรหัสผ่าน
                    </Button>
                <span className=" ml-2 pt-3 text-center text-sm text-muted-foreground">
                    <Link
                        href="/reset"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        ลีมรหัสผ่าน
                    </Link>
                </span>
            </form>
        </Form >
    )
}