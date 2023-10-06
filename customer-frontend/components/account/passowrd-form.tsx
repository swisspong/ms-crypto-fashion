import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod"
const formSchema = z.object({
    oldPassword: z
        .string({ required_error: "ต้องกรอก" })
        .min(4, { message: "ต้องมีตัวอักษรอย่างน้อย 4 ตัว" })
        .trim(),

    newPassword: z
        .string({ required_error: "ต้องกรอก " })
        .min(4, { message: "ต้องมีตัวอักษรอย่างน้อย 4 ตัว" })
        .trim(),

    confirmPassword: z
        .string({ required_error: "ต้องกรอก " })
        .min(4, { message: "ต้องมีตัวอักษรอย่างน้อย 4 ตัว" })
        .trim(),
}).superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
        ctx.addIssue({
            code: "custom",
            message: "รหัสผ่านไม่ตรงกัน"
        });
    }
});

type PasswordFormValues = z.infer<typeof formSchema>;



export function PasswordForm() {
    const defaultValues: Partial<PasswordFormValues> = {};

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: "onChange",
    });
    return (
        <>
        </>
    )
}