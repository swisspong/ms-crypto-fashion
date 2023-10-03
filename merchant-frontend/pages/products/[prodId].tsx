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
import { Checkbox } from "@/components/ui/checkbox";
import Variants from "@/components/products/variants/variants";
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
  categories: z
    .array(z.object({ cat_id: z.string() })),
    // .min(1, { message: "Must have at least 1 category" }),
  categories_web: z
    .array(z.object({ cat_id: z.string() })),
    // .min(1, { message: "Must have at least 1 category" }),

  available: z.boolean(),
  payment_methods: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});
export default function EditProduct() {
  const router = useRouter();
  const { data, isSuccess: prodSuccess } = useProductById(
    router.query.prodId as string
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //   available: true,
      //   name: "Smart Watch",
      //   sku: "SW-WHM-A",
      //   stock: 20,
      //   price: 100,
      //   description:
      //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut euismod enim, at rutrum urna. Etiam finibus, sapien vitae molestie laoreet, dolor massa ultrices urna, eget aliquam enim urna sit amet massa. Aliquam imperdiet erat id risus posuere blandit. Nam imperdiet diam lectus, id dapibus enim interdum sed. Curabitur fermentum.",
      //   image_url:
      //     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
      //   categories: [
      //     { cat_id: "123", name: "Shirt" },
      //     { cat_id: "1234", name: "Jeans" },
      //   ],
    },
  });

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

  const { mutate, isLoading, isSuccess } = useEditProduct();
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
    mutate({ prodId: router.query.prodId as string, body: values });
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
  useEffect(() => {
    if (prodSuccess) {
      form.reset({
        available: data.available,
        categories: data.categories?.map((cat) => ({ cat_id: cat.cat_id })),
        categories_web: data.categories_web?.map((cat) => ({
          cat_id: cat.catweb_id,
        })),
        description: data.description,
        image_urls: data.image_urls?.map((img) => ({ url: img })),
        name: data.name,
        price: data.price,
        sku: data.sku,
        stock: data.stock,
        payment_methods: data.payment_methods.map((payment) => payment),
      });
    }
  }, [prodSuccess]);
  return (
    <Layout>
      <div className="space-between flex items-center mb-4">
        <div className="">
          <h1 className="text-xl font-bold tracking-tight">แก้ไขข้อมูลสินค้า</h1>
        </div>
      </div>

      <Tabs defaultValue="product">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="product">สินค้า</TabsTrigger>
            <TabsTrigger value="variants">ส่วนเสริม</TabsTrigger>
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
                                  disabled={isLoading}
                                  placeholder="ชื่อสินค้า"
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
                              <FormLabel>Sku</FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isLoading}
                                  placeholder="SKU"
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
                                  type="number"
                                  disabled={
                                    isLoading ||
                                    (data?.variants.length ?? 0) > 0
                                  }
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      (e.target.value)
                                    )
                                  }
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
                                  type="number"
                                  disabled={
                                    isLoading ||
                                    (data?.variants.length ?? 0) > 0
                                  }
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      (e.target.value)
                                    )
                                  }
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
                                  disabled={isLoading}
                                  placeholder="บอกเราสักเล็กน้อยเกี่ยวกับสินค้าของคุณ"
                                  className="resize-none"
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
                      <CardTitle className="text-2xl">วิธีการชำระเงิน</CardTitle>
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
                      <CardTitle className="text-2xl">เนื้อหารูปภาพสินค้า</CardTitle>
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
                        บันทึกการเปลี่ยนแปลง
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
                                {field.value === true ? "เปิดขายสินค้า" : "ปิดการขายสินค้า"}
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
                              //onValueChange={field.onChange}
                              onValueChange={(val) => {
                                if (
                                  categories?.data.find(
                                    (cat) => cat.cat_id === val
                                  )
                                )
                                  append({
                                    cat_id: val,
                                  });
                              }}
                              value="init"
                              // defaultValue={field.value}
                              disabled={catLoading || isLoading}
                              //  disabled={addLoading || updateLoading}
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
          value="variants"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          {/* <VariantAllForm /> */}
          <Variants/>
          {/* <VariantForm /> */}

          {/* <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                New Episodes
              </h2>
              <p className="text-sm text-muted-foreground">
                Your favorite podcasts. Updated daily.
              </p>
            </div>
          </div>
          <Separator className="my-4" /> */}
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
