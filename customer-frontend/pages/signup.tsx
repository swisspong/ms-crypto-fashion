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
const inter = Inter({ subsets: ["latin"] });
const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Sku must be at least 2 characters." }),
  email: z.string().email().trim(),
  // .min(2, { message: "Sku must be at least 2 characters." }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters." }),
});
export default function Signup() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { mutate: signinHandler, isLoading, isSuccess } = useSignup();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    signinHandler(values);
  }

  React.useEffect(() => {
    if (isSuccess) router.push("/");
  }, [isSuccess]);
  return (
    <div className="min-h-screen h-full">
      <div className="border-t">
        <div className="h-full fixed inset-0 flex items-center justify-center">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-6">
                    <MetaMask />
                    <Button variant="outline">
                      <Icons.google className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="Username (required)"
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="Email (required)"
                              type="email"
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
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoading}
                              placeholder="Password (required)"
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
                <CardFooter>
                  <Button disabled={isLoading} type="submit" className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create account
                  </Button>
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
