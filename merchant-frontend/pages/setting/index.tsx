import Layout from "@/components/Layout";
import { DataTable } from "@/components/data-table";
import { Icons } from "@/components/icons";
import { columns } from "@/components/orders/column";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { PaginationState } from "@tanstack/react-table";
import { Plus, PlusCircle, Podcast, Upload, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, FieldValues } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import VariantForm from "@/components/products/variant-form";
import { useCategories, useCategoriesMain } from "@/src/hooks/category/queries";
import { useRouter } from "next/router";
import { useEditProduct } from "@/src/hooks/product/mutations";
import FileUploadArr from "@/components/file-upload-arr";
import { Loader2 } from "lucide-react";
import { useProductById } from "@/src/hooks/product/queries";
import VariantAllForm from "@/components/products/variant-all-form";
import FileUploadOne from "@/components/file-upload-one";
import { postAssetBanner } from "@/src/services/asset.service";
import { useEditMerchantProfile } from "@/src/hooks/merchant/mutations";
import { useUserInfo } from "@/src/hooks/user/queries";
import { toast } from "react-toastify";
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." }),
  first_name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." }),
  last_name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." }),
  banner_title: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." }),

  banner_url: z.string().url(),
});
export default function SettingPage() {
  const router = useRouter();
  const { data, isSuccess: prodSuccess } = useProductById(
    router.query.prodId as string
  );
  const userQuery = useUserInfo();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // TODO: Set column in DataTable

  const { mutate, isLoading, isSuccess } = useEditMerchantProfile();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values);
  }

  useEffect(() => {
    if (userQuery.isSuccess) {
      form.reset({
        banner_title: userQuery.data.merchant.banner_title,
        banner_url: userQuery.data.merchant.banner_url,
        first_name: userQuery.data.merchant.first_name,
        last_name: userQuery.data.merchant.last_name,
        name: userQuery.data.merchant.name,
      });
    }
  }, [userQuery.isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Save data successfully");
    }
  }, [isSuccess]);
  return (
    <Layout>
      <div className="space-between flex items-center mb-4">
        <div className="">
          <h1 className="text-xl font-bold tracking-tight">Edit Product</h1>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 grid gap-4">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2 col-span-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Name (required)"
                              disabled={isLoading}
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
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Firstname</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Firstname (required)"
                              disabled={isLoading}
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
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lastname</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Lastname (required)"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Banner</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="banner_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner image</FormLabel>
                          <FormControl>
                            <FileUploadOne
                              onChange={field.onChange}
                              image_url={field.value}
                              cbAsset={postAssetBanner}
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
                      name="banner_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Banner titile (required)"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save Changes
                  </Button>
                </CardHeader>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </Layout>
  );
}
