import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router"
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { withoutUserResetPassword } from "@/src/hooks/auth/auth-hook";
import { useResetPassword } from "@/src/hooks/user/mutations";
import { CheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { StatusFormat } from "@/src/types/enums/common";
import { toast } from "react-toastify";
import { useSignout } from "@/src/hooks/auth/mutations";

const formSchema = z.object({
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
})
const PasswordResetPage = () => {
    const router = useRouter()
    const token = router.query.token as string

    const [status, setStatus] = useState<string | undefined>()
    const {
        mutate: signoutHandler,
        isLoading: siginoutLoading,
        isSuccess: signoutSuccess,
    } = useSignout();
    const { mutateAsync: handleResetPassword, isSuccess, isLoading } = useResetPassword()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { new_password } = values
        const result = await handleResetPassword({
            token,
            data: {
                password: new_password
            }
        })

        console.log(result)
        setStatus(result.status)
        if (result.status === StatusFormat.FAILURE) {
            toast('เกิดข้อผิดพลาด')
        }

        signoutHandler()



    }

    return (
        <div className="min-h-screen h-full">
            <div className="border-t">
                <div className="h-full fixed inset-0 flex items-center justify-center">
                    {status != StatusFormat.SUCCESS ? (
                        <Card className="max-w-[400px] w-full">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">ลืมรหัสผ่าน</CardTitle>
                                <CardDescription>
                                    กรอกรหัสผ่านใหม่ของคุณด้านล่าง
                                </CardDescription>
                            </CardHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <CardContent className="grid gap-4">


                                        <div className="grid gap-2">
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
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex flex-col items-start">
                                        <Button
                                            disabled={isLoading}
                                            type="submit" className="w-full">
                                            {isLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : null}
                                            บันทึก
                                        </Button>

                                    </CardFooter>
                                </form>
                            </Form>
                        </Card>
                    ) : (
                        <Card className="w-9/12 sm:w-96">
                            <CardHeader>
                                <div className="flex items-center justify-center w-full">
                                    <CheckIcon className="mr-2 h-16 w-16" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl text-muted-foreground">
                                        <span>เปลี่ยนรหัสผ่านสำเร็จ </span>
                                    </p>
                                </div>
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                                <Button
                                    className="w-full"
                                    onClick={() => router.push('signin')}
                                >
                                    เข้าสู่ระบบ
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                    }

                </div>
            </div>
        </div>
    )
}

export default PasswordResetPage
export const getServerSideProps = withoutUserResetPassword()