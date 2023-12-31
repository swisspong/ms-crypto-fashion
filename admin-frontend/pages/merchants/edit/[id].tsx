import Layout from "@/components/Layout";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/router";
import { useGetMerchantById } from "@/src/hooks/merchant/queries";
import { useUpdateMerchant } from "@/src/hooks/merchant/mutaions";

const formSchema = z.object({
    store_name: z.string({ required_error: "ต้องกรอก" }).min(2, { message: "ต้องมีตัวอักษรอย่างน้อย 2 ตัว" }).trim(),
    banner_title: z.string({ required_error: "ต้องกรอก" }).min(2, { message: "ต้องมีตัวอักษรอย่างน้อย 2 ตัว" }).trim(),
    img_id_card: z.string().trim().url().optional(),
    image_url: z.string().trim().url().optional()
})

export default function Edit() {
    const router = useRouter()
    const id = router.query.id
    const { data: defaultData, isLoading: defaultLoading, isSuccess: defaultSuccess } = useGetMerchantById(id)
    const {mutate: updateHandler, isLoading, isSuccess} = useUpdateMerchant(id!)
    

    console.log(defaultData)
    // TODO: hook form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            store_name: defaultData?.name,
            banner_title: defaultData?.banner_title,
            img_id_card: undefined,
            image_url: undefined
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const {banner_title, store_name} = values
        const body: IMerchantPayload = {
            banner_title,
            name: store_name
        }

        updateHandler(body)
    }

    useEffect(() => {
        if (isSuccess) {
            router.push("/merchants");
          }
    }, [isSuccess])

    useEffect(() => {
      if (defaultSuccess)  {
        form.reset({
            store_name: defaultData.name,
            banner_title: defaultData.banner_title
        })
      }
    }, [defaultSuccess])

    return (
        <Layout>
            <h2 className="text-xl mb-5 font-bold tracking-tight">แก้ไขร้านค้า</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="container content-start flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-3 lg:px-0 gap-4">
                        <div className="col-span-2">
                            <div className="mb-10">
                                <Card >
                                    <CardHeader>
                                        <CardTitle>กรอกรายละเอียด</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="store_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ชื่อร้านค้า</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="กรอกชื่อร้านค้า"
                                                            type="text"
                                                            autoCapitalize="none"
                                                            autoComplete="name"
                                                            autoCorrect="off"
                                                            disabled={isLoading || defaultLoading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="banner_title"
                                            render={({ field }) => (
                                                <FormItem className="mt-5">
                                                    <FormLabel>แบนเนอร์</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="ช่วยเล่าให้ฟังเกี่ยวกับร้านค้า"
                                                            className="resize-none"
                                                            disabled={isLoading || defaultLoading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </CardContent>
                                </Card>
                                {/* 
                                <Card className="mt-5">
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
                                                        <FormLabel>Image profile store</FormLabel>
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
                                </Card>

                                <Card className="mt-5">
                                    <CardHeader className="space-y-1">
                                        <CardTitle className="text-2xl">Asset</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        <div className="grid gap-2">
                                            <FormField
                                                control={form.control}
                                                name="img_id_card"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Image identity card</FormLabel>
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
                        </div>
                        <div className="col-span-1 h-full">
                            <Card className="p-4">
                                <Button className="w-full font-bold" disabled={isLoading || defaultLoading}>
                                    {isLoading   && (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </Layout>
    )
}