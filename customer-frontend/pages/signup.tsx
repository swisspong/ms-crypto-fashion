import Image from "next/image";
import { Inter } from "next/font/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import MetaMask from "@/components/meta-mask";
import { withoutUser } from "@/src/hooks/auth/auth-hook";
import { ToastContainer, toast } from "react-toastify";
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
import { useRouter } from "next/router";
import { useSignup } from "@/src/hooks/auth/mutations";
import React from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GoogleButton from "@/components/google-button";
const inter = Inter({ subsets: ["latin"] });
const formSchema = z.object({
  username: z
    .string({ required_error: "ต้องกรอก" })
    .min(3, { message: "ต้องมีตัวอักษรอย่างน้อย 3 ตัว" })
    .trim(),
  email: z
    .string({ required_error: "ต้องกรอก" })
    .email({ message: "อีเมลไม่ถูกต้อง" })
    .trim(),
  password: z
    .string({ required_error: "ต้องกรอก" })
    .min(4, { message: "ต้องมีตัวอักษรอย่างน้อย 4 ตัว" })
    .trim(),
});
export default function Signup() {
  const router = useRouter();
  // const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { mutate: signinHandler, isLoading, isSuccess } = useSignup();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    signinHandler(values);
  }

  React.useEffect(() => {
    if (isSuccess) {
      toast.success(`ลงทะเบียนสำเร็จ กรุณาตรวจสอบอีเมลของคุณ`, {
        // position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // theme: "dark",
      });
      router.push("/signin");
    }
  }, [isSuccess]);
  return (
    <div className="min-h-screen h-full ">
      <div className="border-t">
        <div className="h-full fixed inset-0 flex items-center justify-center">
          <Card className="max-w-[400px] w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">สร้างบัญชี</CardTitle>
              <CardDescription>
                กรอกอีเมลของคุณด้านล่างเพื่อสร้างบัญชีของคุณ
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-6">
                    <MetaMask />
                    {/* <Button type="button" variant="outline">
                      <Icons.google className="mr-2 h-4 w-4" />
                      Google
                    </Button> */}
                     <GoogleButton />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        หรือดำเนินการต่อด้วย
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ชื่อผู้ใช้</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="ชื่อผู้ใช้ (ต้องกรอก)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>อีเมล</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="อีเมล (ต้องกรอก)"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>รหัสผ่าน</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="รหัสผ่าน (ต้องกรอก)"
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" /> */}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <Button disabled={isLoading} type="submit" className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    สร้างบัญชี
                  </Button>
                  <p className="pt-3 text-center text-sm text-muted-foreground">
                    <Link
                      href="/signin"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      ไปที่หน้าเข้าสู่ระบบ
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withoutUser();
