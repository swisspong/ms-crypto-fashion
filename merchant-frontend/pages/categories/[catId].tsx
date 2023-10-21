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
import { withUser } from "@/src/hooks/user/auth/auth-hook";
import { useCategoryById } from "@/src/hooks/category/queries";
import { useRouter } from "next/router";
import { useEditCategory } from "@/src/hooks/category/mutations";
import { RoleFormat } from "@/src/types/user";
import { toast } from "react-toastify";
const formSchema = z.object({
  name: z
    .string({ required_error: "ต้องกรอก" })
    .trim()
    .min(3, { message: "ต้องมีอย่างน้อย 3 ตัวอักษร" }),
  // description: z
  //   .string()
  //   .trim()
  //   .min(2, { message: "Description must be at least 2 characters." }),
  // image_url: z.string().url(),
});
export default function EditCategory() {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { data, isSuccess: catSuccess } = useCategoryById(
    router.query.catId as string
  );
  const { mutate, isLoading, isSuccess } = useEditCategory();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //   name: "Jeans",
      //   description:
      //     "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
      //   image_url:
      //     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
    },
  });
  useEffect(() => {
    if (catSuccess) {
      form.reset({
        ...data,
      });
    }
  }, [catSuccess]);
  useEffect(() => {
    if (isSuccess) {
      toast.success("แก้ไขสำเร็จ!", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push("/categories");
    }
  }, [isSuccess]);
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
    mutate({ catId: router.query.catId as string, body: values });
  }

  return (
    <Layout>
      <div className="space-between flex items-center mb-4">
        <div className="">
          <h1 className="text-xl font-bold tracking-tight">
            แก้ไขหมวดหมู่สินค้าภายในร้านค้า
          </h1>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 grid gap-4">
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
                          <FormLabel>หมวดหมู่</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ชื่อหมวดหมู่"
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
                    บันทึกการเปลี่ยนแปลง
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
