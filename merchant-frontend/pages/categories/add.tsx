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
import { Loader2, Plus, PlusCircle, Podcast, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import { useAddCategory } from "@/src/hooks/category/mutations";
import { useRouter } from "next/router";
import { withUser } from "@/src/hooks/user/auth/auth-hook";
import { RoleFormat } from "@/src/types/user";
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, { message: "Category name must be at least 4 characters." }),
  // description: z
  //   .string()
  //   .trim()
  //   .min(2, { message: "Description must be at least 2 characters." }),
  image_url: z.string().url().optional(),
});
export default function AddCategory() {
  const fileRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const router = useRouter();

  // TODO: Set column in DataTable
  const [idToUpdate, setIdToUpdate] = useState<string>();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { mutate, isLoading, isSuccess } = useAddCategory();
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

  const dataQuery: { data: { data: IOrderRow[]; total_page: number } } = {
    data: {
      data: [
        {
          id: "cat_1",
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
          amount: 20,
          created_at: "2023-06-15T08:39:59.434Z",
          email: "swiss@gmail.com",
          status: "NOT PAID",
        },
      ],
      total_page: 1,
    },
  };
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
    mutate(values);
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
          <h1 className="text-xl font-bold tracking-tight">Add Category</h1>
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
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
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
                  {/* <div className="grid gap-2">
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
                  </div> */}
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
            <div className="col-span-2">
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
export const getServerSideProps = withUser([RoleFormat.MERCHANT]);
