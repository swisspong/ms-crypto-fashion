import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { withUserPermission } from "@/src/hooks/auth/isAuth";
import { useGetPermissionInfo } from "@/src/hooks/permission/queries";
import { Switch } from "@/components/ui/switch";
import { useGetAdminById } from "@/src/hooks/admin/queries";
import { useUpdateAdmin } from "@/src/hooks/admin/mutaions";

const formSchema = z.object({
    name: z.string({ required_error: "ต้องกรอก" }).min(2, { message: "ต้องมีตัวอักษรอย่างน้อย 2 ตัว" }).trim(),
    email: z.string({ required_error: "ต้องกรอก" }).min(2, { message: "ต้องมีตัวอักษรอย่างน้อย 2 ตัว" }).trim(),
    password: z.string({ required_error: "ต้องกรอก" }).min(2, { message: "ต้องมีตัวอักษรอย่างน้อย 2 ตัว" }).trim()
})




export default function Edit() {
    const router = useRouter()
    const id = router.query.id
    const databody = useGetAdminById(id)

    const { mutate: updateAdminHandler, isLoading, isSuccess } = useUpdateAdmin(id)
    const { data } = useGetPermissionInfo()
    // const [isLoading, setIsLoading] = useState<boolean>(false)

    const permissionsObject: Record<string, z.ZodType<any>> = {};

    data?.forEach((permission) => {
        permissionsObject[permission] = z.boolean().default(false);
    });

    const FormSchema = formSchema.merge(z.object(permissionsObject));

    const defaultValues = {
        name: '',
        email: '',
        ...Object.fromEntries(Object.keys(permissionsObject).map((permission) => [permission, false])),
    };


    // TODO: hook form
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues
    })




    // * function on click submit

    function onSubmit(values: z.infer<typeof FormSchema>) {
        console.log(values)
        const permissions: permission[] = []
        Object.entries(values).forEach(([key, value]) => {
            if (value === true) {
                permissions.push({ permission: key });
            }
        });

        const objectUpdate: IPutAdminPlayload = {
            email: values.email,
            username: values.name,
            permissions,
        }

        let objectUpdates: IPutAdminPlayload = { email: "", permissions, username: "" }

        if (values.password) {
            objectUpdates = {
                ...objectUpdate,
                password: values.password
            }
        } else {
            objectUpdates = { ...objectUpdate }
        }

        updateAdminHandler(objectUpdates)
    }

    useEffect(() => {
        if (isSuccess) router.push('/admins')
    }, [isSuccess])

    useEffect(() => {
        const permissions = databody.data?.permission
        form.reset(
            {
                name: databody.data?.username,
                email: databody.data?.email,
                ...Object.fromEntries(Object.keys(permissionsObject).map((permission) => {
                    console.log([permission, permissions?.includes(permission)])
                    return [permission, permissions?.includes(permission)]
                }))
                
            }
        )
    }, [databody.isSuccess])

    return (
        <Layout>
            <h2 className="text-xl font-bold tracking-tight mb-5">แก้ไขข้อมูลแอดมิน (ผู้ดูแล)</h2>
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
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="กรอกชื่อแอดมิน"
                                                            type="text"
                                                            autoCapitalize="none"
                                                            autoComplete="name"
                                                            autoCorrect="off"
                                                            disabled={isLoading || databody.isLoading}

                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />





                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="mt-5">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="กรอกอีเมล"
                                                            type="email"
                                                            autoCapitalize="none"
                                                            autoComplete="email"
                                                            autoCorrect="off"
                                                            disabled={isLoading || databody.isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="mt-5">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="ตั้งรหัสผ่านใหม่"
                                                            type="password"
                                                            autoCapitalize="none"
                                                            autoComplete="password"
                                                            autoCorrect="off"
                                                            disabled={isLoading || databody.isLoading}
                                                            onChange={e => field.onChange(e.target.value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="mt-5" >
                                    <CardHeader>
                                        <CardTitle>สิทธิ์การอนุญาต  </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {
                                            data ? (
                                                data.map((val) => (

                                                    <FormField
                                                        key={`field_${val}`}
                                                        control={form.control}
                                                        name={val}
                                                        render={({ field }) => (
                                                            <FormItem key={`item_${val}`} className="mt-2 flex flex-row items-center justify-between rounded-lg border p-4">
                                                                <div className="space-y-0.5">
                                                                    <FormLabel key={`label_${val}`} className="text-base">
                                                                        {val.toUpperCase().replace(/_/g, ' ')}
                                                                    </FormLabel>
                                                                </div>
                                                                <FormControl key={`control_${val}`}>

                                                                    <Switch
                                                                        {...field}
                                                                        key={`switch_${val}`}
                                                                        disabled={isLoading || databody.isLoading}
                                                                        checked={(field.value !== undefined ? field.value : false)}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />

                                                ))
                                            ) : (<></>)
                                        }
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="col-span-1 h-full">
                            <Card className="p-4">
                                <Button className="w-full font-bold" disabled={isLoading}>
                                    {isLoading && (
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

export const getServerSideProps = withUserPermission(["update_admin"], "/admins");