import Layout from "@/components/Layout";
import FileUpload from "@/components/file-upload";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { withUser } from "@/src/hooks/auth/isAuth";
import { useAddCategory } from "@/src/hooks/category/mutaions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod"

const formSchema = z.object({
    name: z
        .string({ required_error: "ต้องกรอก" })
        .min(2, { message: "ต้องมีตัวอักษรอย่างน้อย 2 ตัว" }).trim(),
    image_url: z.string().url().optional(),
});

export default function Add() {
    
    const router = useRouter()

    // * Query 
    const {mutate: categoryHandler, isLoading, isSuccess} = useAddCategory()

    // TODO: hook form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        }
    })

    // ** function on click submit
    function onSubmit(values: z.infer<typeof formSchema>) {
       categoryHandler(values)
    }

    useEffect(() => {
        if (isSuccess) {
          router.push("/categories");
        }
      }, [isSuccess]);

    return (
        <Layout>
            <div className="space-between flex items-center mb-4">
                <div className="">
                    <h1 className="text-xl font-bold tracking-tight">เพิ่มหมวดหมู่สินค้าภายในเว็บไซต์</h1>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-5 gap-4">
                        <div className="md:col-span-3 col-span-5 grid gap-4">
                            <Card>
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl">กรอกรายละเอียด</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ชื่อหมวดหมู่</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="ชื่อหมวดหมู่ (ต้องกรอก)" disabled={isLoading} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <Card>
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-2xl">Asset</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid gap-2">
                                        <FormField
                                            control={form.control}
                                            name="image_url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Image</FormLabel>
                                                    <FormControl>
                                                        <FileUpload
                                                            onChange={field.onChange}
                                                            image_url={field.value}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card> */}
                        </div>
                        <div className="md:col-span-2 col-span-5">
                            <Card>
                                <CardHeader>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && (
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        บันทึก
                                    </Button>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </Layout>
    )
} 

export const getServerSideProps = withUser()