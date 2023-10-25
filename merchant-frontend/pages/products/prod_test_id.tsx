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
import { useMemo, useRef, useState } from "react";
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
// import VariantForm from "@/components/products/variant-form";
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
  image_url: z.string().url(),
  status: z.string().optional(),
  categories: z.array(z.object({ cat_id: z.string(), name: z.string() })),
  available: z.boolean(),
});
export default function EditProduct() {
  const fileRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      available: true,
      name: "Smart Watch",
      sku: "SW-WHM-A",
      stock: 20,
      price: 100,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut euismod enim, at rutrum urna. Etiam finibus, sapien vitae molestie laoreet, dolor massa ultrices urna, eget aliquam enim urna sit amet massa. Aliquam imperdiet erat id risus posuere blandit. Nam imperdiet diam lectus, id dapibus enim interdum sed. Curabitur fermentum.",
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
      categories: [
        { cat_id: "123", name: "Shirt" },
        { cat_id: "1234", name: "Jeans" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  // TODO: Set column in DataTable
  const [idToUpdate, setIdToUpdate] = useState<string>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const openDialogHandlerParam = (open: boolean) => {
    if (!open) {
      setIdHandler(undefined);
    }
    setOpenDialog(open);
  };
  const openDialogHandler = () => {
    setOpenDialog((prev) => !prev);
  };
  const openSheetHandler = () => {
    setOpen((prev) => !prev);
  };

  const openSheetHandlerParam = (con: boolean) => {
    if (!con) {
      setIdHandler(undefined);
    }
    setOpen(con);
  };
  const setIdHandler = (id: string | undefined) => {
    setIdToUpdate(id);
  };
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // const dataQuery: { data: { data: IOrderRow[]; total_page: number } } = {
  //   data: {
  //     data: [
  //       {
  //         id: "cat_1",
  //         image:
  //           "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
  //         amount: 20,
  //         created_at: "2023-06-15T08:39:59.434Z",
  //         email: "swiss@gmail.com",
  //         status: "NOT PAID",
  //       },
  //     ],
  //     total_page: 1,
  //   },
  // };
  const defaultData = useMemo(() => [], []);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
  }
  const allowOnlyNumber = (value: any) => {
    if (Number(value) <= 0) {
      return 0;
    }

    return value;
  };

  return (
    <Layout>
      <div className="space-between flex items-center mb-4">
        <div className="">
          <h1 className="text-xl font-bold tracking-tight">Edit Product</h1>
        </div>
      </div>

      <Tabs defaultValue="product">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="product" className="border-none p-0 outline-none">
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
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Name (required)"
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
                                  placeholder="SKU (required)"
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
                              <FormLabel>Stock</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number(allowOnlyNumber(e.target.value))
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
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number(allowOnlyNumber(e.target.value))
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
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us a little bit about your category"
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
                  </Card>
                </div>
                <div className="col-span-2 space-y-4">
                  <Card>
                    <CardHeader>
                      <Button type="submit" className="w-full">
                        Save Changes
                      </Button>
                      <FormField
                        control={form.control}
                        name="available"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl className="">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />

                                <FormLabel className="items-center">
                                  Available
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
                        {fields.map((field, index) => (
                          <Badge
                            key={field.id}
                            className="flex items-center justify-center"
                          >
                            <p>{field.name}</p>
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
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              //onValueChange={field.onChange}
                              onValueChange={(val) => {
                                field.onChange("");
                                append({
                                  cat_id: val,
                                  name: [
                                    { id: "123", name: "Shirt" },
                                    { id: "1234", name: "Jeans" },
                                    { id: "12345", name: "Men" },
                                    { id: "123456", name: "Women" },
                                    { id: "1234567", name: "Kid" },
                                  ].find((item) => item.id === val)?.name!,
                                });
                              }}
                              value={field.value}
                              // defaultValue={field.value}
                              //  disabled={addLoading || updateLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  { id: "123", name: "Shirt" },
                                  { id: "1234", name: "Jeans" },
                                  { id: "12345", name: "Men" },
                                  { id: "123456", name: "Women" },
                                  { id: "1234567", name: "Kid" },
                                ]
                                  .filter((item) => {
                                    if (!form.getValues("categories")) {
                                      return true;
                                    }
                                    return !form
                                      .getValues("categories")
                                      .find((cat) => cat.cat_id === item.id);
                                  })
                                  .map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
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
          {/* <VariantForm/> */}
         

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
