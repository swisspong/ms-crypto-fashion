import Layout from "@/components/Layout";

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
import { Loader2, Plus, PlusCircle, Podcast, Upload, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, FieldValues } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import { withUser } from "@/src/hooks/user/auth/auth-hook";
import { RoleFormat } from "@/src/types/user";
import FileUploadArr from "@/components/file-upload-arr";
import { useCategories, useCategoriesMain } from "@/src/hooks/category/queries";
import { useAddProduct } from "@/src/hooks/product/mutations";
import { useRouter } from "next/router";
import { Checkbox } from "@/components/ui/checkbox";
const items = [
  {
    id: "credit",
    label: "ชำระด้วย credit card",
  },
  {
    id: "wallet",
    label: "ชำระด้วย metamask wallet",
  },
] as const;
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." }),
  sku: z
    .string()
    .trim()
    .min(2, { message: "Sku must be at least 2 characters." }),
  stock: z.number().int().min(0),
  price: z.number().int().min(0),
  description: z
    .string()
    .trim()
    .min(2, { message: "Description must be at least 2 characters." }),
  image_urls: z
    .array(z.object({ url: z.string().url() }))
    .min(1, { message: "Must have at least 1 image" }),
  categories: z.array(z.object({ cat_id: z.string() })),
  // .min(1, { message: "Must have at least 1 category" }),
  categories_web: z.array(z.object({ cat_id: z.string() })),
  // .min(1, { message: "Must have at least 1 category" }),
  available: z.boolean(),
  payment_methods: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});
export default function AddProduct() {
  const fileRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    //  mode:"all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      available: false,
      stock: 0,
      price: 0,
      payment_methods: [],
      // categories: [
      //   { cat_id: "123", name: "Shirt" },
      //   { cat_id: "1234", name: "Jeans" },
      // ],
    },
  });
  const router = useRouter();
  const { mutate, isLoading, isSuccess } = useAddProduct();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });
  const {
    fields: catFields,
    append: catAppend,
    remove: catRemove,
  } = useFieldArray({
    control: form.control,
    name: "categories_web",
  });

  // TODO: Set column in DataTable

  const { data: categories, isLoading: catLoading } = useCategories({
    page: 1,
    per_page: 100,
  });
  const dataQeury = useCategoriesMain({
    page: 1,
    per_page: 100,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
    mutate(values);
  }

  const {
    fields: images,
    append: imageAppend,
    remove: imageRemove,
  } = useFieldArray({
    control: form.control,
    name: "image_urls",
  });

  useEffect(() => {
    if (isSuccess) {
      router.push("/products");
    }
  }, [isSuccess]);
  return (
    <Layout>
      <div className="space-between flex items-center mb-4">
        <div className="">
          <h1 className="text-xl font-bold tracking-tight">เพิ่มสินค้า</h1>
        </div>
      </div>

      <Tabs defaultValue="product">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="product">สินค้า</TabsTrigger>
            <TabsTrigger value="podcasts" disabled>
              ส่วนเสริม
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="product" className="border-none p-0 outline-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 grid gap-4">
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl">รายละเอียด</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2 col-span-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>สินค้า</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ชื่อสินค้า (ต้องกรอก)"
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
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="SKU (ต้องกรอก)"
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
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>จำนวนสินค้า</FormLabel>
                              <FormControl>
                                <Input
                                  //type="number"
                                  disabled={isLoading}
                                  {...field}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    field.onChange(Number(numericValue));
                                  }}
                                  // disabled={addLoading || updateLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2 col-span-2">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ราคา</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isLoading}
                                  {...field}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
                                    field.onChange(Number(numericValue));
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2 col-span-2">
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>รายละเอียดสินค้า</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="บอกเราสักเล็กน้อยเกี่ยวกับสินค้าของคุณ"
                                  className="resize-none"
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
                      <CardTitle className="text-2xl">
                        วิธีการชำระเงิน
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="payment_methods"
                          render={() => (
                            <FormItem>
                              {items.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="payment_methods"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              item.id
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    item.id,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== item.id
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item.label}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl">
                        เนื้อหารูปภาพสินค้า
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="image_urls"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <FileUploadArr
                                  onChange={field.onChange}
                                  image_url={field.value}
                                  remove={imageRemove}
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
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        บันทึก
                      </Button>
                      <FormField
                        control={form.control}
                        name="available"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl className="">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  disabled={isLoading}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />

                                <FormLabel className="items-center">
                                  {field.value === true
                                    ? "เปิดขายสินค้า"
                                    : "ปิดการขายสินค้า"}
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div
                        className="flex gap-2 flex-wrap justify-evenly"
                        //className="grid grid-cols-5 gap-2"
                      >
                        {catFields.map((field, index) => (
                          <Badge
                            key={field.id}
                            className="flex items-center justify-center"
                          >
                            <p>
                              {
                                dataQeury.data?.data.find(
                                  (cat) => cat.catweb_id === field.cat_id
                                )?.name
                              }
                            </p>
                            <button className="ml-2">
                              <X
                                className="h-4 w-4"
                                onClick={() => catRemove(index)}
                              />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>หมวดหมู่สินค้าภายในเว็บไซต์</FormLabel>
                            <Select
                              value="init"
                              onValueChange={(val) => {
                                // field.onChange("");
                                if (
                                  dataQeury.data?.data.find(
                                    (cat) => cat.catweb_id === val
                                  )
                                )
                                  catAppend({
                                    cat_id: val,
                                  });
                              }}
                              //value={field.value}
                              disabled={dataQeury.isLoading || isLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={"init"}>
                                  เลือกหมวดหมู่สินค้า
                                </SelectItem>
                                {dataQeury.data?.data
                                  .filter((item) => {
                                    if (!form.getValues("categories_web")) {
                                      return true;
                                    }
                                    return !form
                                      .getValues("categories_web")
                                      .find(
                                        (cat) => cat.cat_id === item.catweb_id
                                      );
                                  })
                                  .map((item) => (
                                    <SelectItem value={item.catweb_id}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div
                        className="flex gap-2 flex-wrap justify-evenly"
                        //className="grid grid-cols-5 gap-2"
                      >
                        {fields.map((field, index) => (
                          <Badge
                            key={field.id}
                            className="flex items-center justify-center"
                          >
                            <p>
                              {
                                categories?.data.find(
                                  (cat) => cat.cat_id === field.cat_id
                                )?.name
                              }
                            </p>
                            <button className="ml-2">
                              <X
                                className="h-4 w-4"
                                onClick={() => remove(index)}
                              />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>หมวดหมู่สินค้าภายในร้านค้า</FormLabel>
                            <Select
                              value="init"
                              onValueChange={(val) => {
                                // field.onChange("");
                                if (
                                  categories?.data.find(
                                    (cat) => cat.cat_id === val
                                  )
                                )
                                  append({
                                    cat_id: val,
                                  });
                              }}
                              //value={field.value}
                              disabled={catLoading || isLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="เลือกหมวดหมู่สินค้า" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={"init"}>
                                  เลือกหมวดหมู่สินค้า
                                </SelectItem>
                                {categories?.data
                                  .filter((item) => {
                                    if (!form.getValues("categories")) {
                                      return true;
                                    }
                                    return !form
                                      .getValues("categories")
                                      .find(
                                        (cat) => cat.cat_id === item.cat_id
                                      );
                                  })
                                  .map((item) => (
                                    <SelectItem value={item.cat_id}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent
          value="podcasts"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                New Episodes
              </h2>
              <p className="text-sm text-muted-foreground">
                Your favorite podcasts. Updated daily.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
export const getServerSideProps = withUser([RoleFormat.MERCHANT]);
