

import React, { useEffect } from "react"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { useRouter } from "next/router"
import { useSignin } from "@/src/hooks/auth/mutations"

interface AdminAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  email: z.string().trim().min(1, { message: "email must be at least 1 characters." }),
  password: z.string().trim().min(4, { message: "password must be at leat 4 characters. " })
})

export default function AdminAuthForm({ className, ...props }: AdminAuthFormProps) {

  const router = useRouter();

  const { mutate: signinHandler, isLoading, isSuccess } = useSignin()

  useEffect(() => {
    if (isSuccess) router.push('/')
  }, [isSuccess])

  // TODO: hook form
  const fileRef = useRef<HTMLInputElement>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {}
  })

  // ** function on click submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    signinHandler(values)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="อีเมล (ต้องกรอก)"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                        onChange={e => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="รหัสผ่าน (ต้องกรอก)"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect="off"
                        disabled={isLoading}
                        onChange={e => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              เข้าสู่ระบบ
            </Button>
          </div>
        </form>
      </Form>


    </div>
  )
}