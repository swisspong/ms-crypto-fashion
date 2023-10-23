import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSendEmailResetPassword } from "@/src/hooks/user/mutations";
import { StatusFormat } from "@/src/types/enums/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router"
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod"

const formSchema = z.object({
    email: z
        .string({ required_error: "ต้องกรอก" })
        .email({ message: "อีเมลไม่ถูกต้อง" })
        .trim()
});

const SendEmailResetPage = () => {
    const router = useRouter()
    const [status, setStatus] = useState<string | undefined>()
    const { mutateAsync: handleSendReset, isSuccess, isLoading } = useSendEmailResetPassword()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await handleSendReset(values)
        console.log(result)
        setStatus(result.status)
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
                                    กรอกอีเมลของคุณด้านล่างทำการรีเซ็ตผ่าน
                                </CardDescription>
                            </CardHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <CardContent className="grid gap-4">


                                        <div className="grid gap-2">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>อีเมล</FormLabel>
                                                        <FormControl>
                                                            <Input

                                                                {...field}
                                                                placeholder="อีเมล (ต้องกรอก)"
                                                                type="email"
                                                                disabled={isLoading}

                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            กรุณากรอกอีเมลเพื่อทำการรีเซ็ตรหัสผ่าน
                                                        </FormDescription>
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
                                            ส่งข้อมูล
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
                                        <span>ตรวจสอบอีเมลของคุณเพื่อดูลิงก์เพื่อรีเซ็ตรหัสผ่านของคุณ </span>
                                    </p>
                                </div>
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                                <Button
                                    className="w-full"
                                    onClick={() => router.push('signin')}
                                >
                                    กลับ
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                </div>
            </div>
        </div>

    )
}


export default SendEmailResetPage