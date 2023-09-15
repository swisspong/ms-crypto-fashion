import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUploadOne from "../file-upload-one";
import { useCredentialMerchant } from "@/src/hooks/merchant/mutations";
import { useRouter } from "next/router";
const formSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters." }),
  last_name: z
    .string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters." }),
  image_url: z.string().url(),
});
const OpenStoreDialog = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const credentialMutate = useCredentialMerchant();
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    credentialMutate.mutate(values);
    // mutate(values)
  }
  
  useEffect(() => {
    if (credentialMutate.isSuccess) router.push('/');
  },[credentialMutate.isSuccess])
  return (
    <>
      {!credentialMutate.isSuccess && (
        <Dialog >
          <DialogTrigger asChild>
            <Button className="w-full">Open Store</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Credential open store</DialogTitle>
              <DialogDescription>
                Make changes to your credential here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name (required)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name (required)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid  col-span-2 gap-4">
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID card image</FormLabel>
                          <FormControl>
                            <FileUploadOne
                              onChange={field.onChange}
                              image_url={field.value}
                            //   remove={imageRemove}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

    </>

  );
};

export default OpenStoreDialog;
