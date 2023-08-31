import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/icons"
import { useGetPermissionInfo } from "@/src/hooks/permission/queries"
import { withUser, withUserPermission } from "@/src/hooks/auth/isAuth"
import { Switch } from "@/components/ui/switch"
import { useAddAdmin } from "@/src/hooks/admin/mutaions"
import { useRouter } from "next/router"


const formSchema = z.object({
    name: z.string().trim().min(1, { message: "admin name must be at least 1 characters." }),
    email: z.string().trim().min(1, { message: "email must be at least 1 characters." }),
    password: z.string().trim().min(4, { message: "password must be at leat 4 characters. " })
})

const Add = () => {
    const router = useRouter()
    const { data } = useGetPermissionInfo()
    const { mutate: createAdminHandler, isLoading, isSuccess } = useAddAdmin()

    const permissionsObject: Record<string, z.ZodType<any>> = {};

    data?.forEach((permission) => {
        permissionsObject[permission] = z.boolean().default(false);
    });


    // สร้าง updatedFormSchema โดยรวม FormSchema กับ z.object({})
    const FormSchema = formSchema.merge(z.object(permissionsObject));

    const defaultValues = {
        name: '',
        email: '',
        password: '',
        ...Object.fromEntries(Object.keys(permissionsObject).map((permission) => [permission, false])),
    };

    



    // TODO: hook form
    const fileRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues
    })

    // ** function on click submit
    function onSubmit(values: z.infer<typeof FormSchema>) {

        const permissions: permission[] = []
        Object.entries(values).forEach(([key, value]) => {
            if (value === true) {
                permissions.push({ permission: key });
            }
        });

        const objectNewAdmin: IAdminPlayload = {
            username: values.name,
            password: values.password,
            email: values.email,
            permissions: permissions
        }
        createAdminHandler(objectNewAdmin)
    }

    useEffect(() => {
        if (isSuccess) {
            router.push("/admins");
          }
    }, [isSuccess])

    return (
        <Layout>
            <h2 className="text-xl font-bold tracking-tight mb-5">Add Admin</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="container content-start flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-3 lg:px-0 gap-4">
                        <div className="col-span-2">
                            <div className="mb-10">
                                <Card >
                                    <CardHeader>
                                        <CardTitle>Details</CardTitle>
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
                                                            placeholder="Enter name admin"
                                                            type="text"
                                                            autoCapitalize="none"
                                                            autoComplete="name"
                                                            autoCorrect="off"
                                                            disabled={isLoading}

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
                                                            placeholder="name@example.com"
                                                            type="email"
                                                            autoCapitalize="none"
                                                            autoComplete="email"
                                                            autoCorrect="off"
                                                            disabled={isLoading}

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
                                                            {...field}
                                                            placeholder="password"
                                                            type="password"
                                                            autoCapitalize="none"
                                                            autoComplete="password"
                                                            autoCorrect="off"
                                                            disabled={isLoading}

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
                                        <CardTitle>Permissions</CardTitle>
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
                                                                        disabled={isLoading}
                                                                        checked={(field.value !== undefined ? field.value:false )}
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
                                    Save Changes
                                </Button>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </Layout>
    )
}

export const getServerSideProps = withUserPermission(["create_admin"], "/admins");

export default Add