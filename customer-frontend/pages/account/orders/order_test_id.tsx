import Image from "next/image";
import { Inter } from "next/font/google";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import MetaMask from "@/components/meta-mask";
import Container from "@/components/container";
import Billboard from "@/components/billboard";
import Navbar from "@/components/navbar";
import * as z from "zod";
import ProductList from "@/components/product-list";
import Footer from "@/components/footer";
import MobileFilters from "@/components/mobile-filter";
import Filter from "@/components/filter";
import ProductCard from "@/components/product-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck } from "lucide-react";
import { Form } from "@/components/ui/form";
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .trim()
    .min(2, { message: "Description must be at least 2 characters." }),
  image_url: z.string().url(),
});
const inter = Inter({ subsets: ["latin"] });

export default function Order() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Jeans",
      description:
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
      image_url:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (!id) addHandler(values)
    // else updateHandler(values)
    console.log(values);
  }
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        {/* <Billboard />s */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-24">
          <div className="space-between flex items-center mb-4">
            <div className="">
              <h1 className="text-xl font-bold tracking-tight">Order #FDSAF-1234</h1>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 grid gap-4">
                  <Card>
                    <CardHeader className="space-y-1 flex-row  w-full justify-between items-center">
                      <CardTitle className="text-2xl">Details</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant={"destructive"} size={"sm"}>
                          Cancel Order
                        </Button>
                        <Button variant={"outline"} size={"sm"}>
                          Refund
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                        <div className="flex-col">
                          <p className="text-xs">REFERENCE</p>
                          <p className="text-sm">FDSAF-1234</p>
                        </div>
                        <div className="flex-col items-end">
                          <p className="text-xs text-end">PLACED</p>
                          <p className="text-sm">04/24/2023 @ 12:29 AM</p>
                        </div>
                      </div>
                      <div className="rounded-md border mb-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="">PRODUCT</TableHead>
                              <TableHead>QTY</TableHead>
                              <TableHead className="text-right">
                                AMOUNT
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={
                                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                                    }
                                    className="object-cover h-14 w-14 rounded-md"
                                  />
                                  <div>{"watch"}</div>
                                </div>
                              </TableCell>
                              <TableCell>{1}</TableCell>
                              <TableCell className="text-right">
                                {"500.00"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={
                                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                                    }
                                    className="object-cover h-14 w-14 rounded-md"
                                  />
                                  <div>{"watch"}</div>
                                </div>
                              </TableCell>
                              <TableCell>{1}</TableCell>
                              <TableCell className="text-right">
                                {"500.00"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      <div className="rounded-md border mb-4">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">
                                <div>{"Subtotal"}</div>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right">
                                {"$500.00"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">
                                <div>{"Shipping"}</div>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right">
                                {"$0.00"}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">
                                <div>{"Total paid"}</div>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right">
                                {"$500.00"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      {/* <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name (required)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
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
             
                  <Card>
                    <CardHeader className="space-y-1 flex-row  w-full justify-between items-center">
                      <CardTitle className="text-2xl">Shipment</CardTitle>

                      {/* <Button variant={"outline"} size={"sm"}>
                    Fullfill
                  </Button> */}
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {/* <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                    <div className="flex-col">
                      <p className="text-xs">REFERENCE</p>
                      <p className="text-sm">FDSAF-1234</p>
                    </div>
                    <div className="flex-col items-end">
                      <p className="text-xs text-end">PLACED</p>
                      <p className="text-sm">04/24/2023 @ 12:29 AM</p>
                    </div>
                  </div> */}
                      <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex p-3 flex-col space-y-4">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                          <div className="flex-col">
                            <p className="text-xs">REFERENCE</p>
                            <p className="text-sm">FDSAF-1234</p>
                          </div>
                          <div className="flex-col items-end">
                            <p className="text-xs text-end">DATE SHIPPED</p>
                            <p className="text-sm">04/24/2023 @ 12:29 AM</p>
                          </div>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                          <div className="flex-col">
                            <p className="text-xs">Flash Express</p>
                            <p className="text-sm">
                              TRACKING #https://flash.com/tracking/fkjdaljlfd3
                            </p>
                          </div>
                          <div className="flex justify-center">
                            <Truck className="w-8 h-8" />
                          </div>
                        </div>
                        <div className="rounded-md border w-full">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="">PRODUCT</TableHead>
                                {/* <TableHead>QTY</TableHead> */}
                                <TableHead className="text-right">
                                  QTY
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={
                                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                                      }
                                      className="object-cover h-14 w-14 rounded-md"
                                    />
                                    <div>{"watch"}</div>
                                  </div>
                                </TableCell>
                                {/* <TableCell>{1}</TableCell> */}
                                <TableCell className="text-right">
                                  {"2"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {/* <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name (required)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
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
                <CardHeader className="space-y-1 flex-row  w-full justify-between items-center">
                  <CardTitle className="text-2xl">Details</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant={"destructive"} size={"sm"}>
                      Cancel Order
                    </Button>
                    <Button variant={"outline"} size={"sm"}>
                      Refund
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex justify-between items-center p-3">
                    <div className="flex-col">
                      <p className="text-xs">REFERENCE</p>
                      <p className="text-sm">FDSAF-1234</p>
                    </div>
                    <div className="flex-col items-end">
                      <p className="text-xs text-end">PLACED</p>
                      <p className="text-sm">04/24/2023 @ 12:29 AM</p>
                    </div>
                  </div>
                  <div className="rounded-md border mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="">PRODUCT</TableHead>
                          <TableHead>QTY</TableHead>
                          <TableHead className="text-right">AMOUNT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                                }
                                className="object-cover h-14 w-14 rounded-md"
                              />
                              <div>{"watch"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{1}</TableCell>
                          <TableCell className="text-right">
                            {"500.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                                }
                                className="object-cover h-14 w-14 rounded-md"
                              />
                              <div>{"watch"}</div>
                            </div>
                          </TableCell>
                          <TableCell>{1}</TableCell>
                          <TableCell className="text-right">
                            {"500.00"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="rounded-md border mb-4">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Subtotal"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            {"$500.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Shipping"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            {"$0.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Total paid"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            {"$500.00"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
           
                </CardContent>
              </Card> */}
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
                <div className="flex flex-col col-span-2 gap-4">
                  {/* <Card>
                <CardHeader>
                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </CardHeader>
              </Card> */}

                  <div className="rounded-md border">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Order Status"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center">
                              <div className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none  no-underline group-hover:no-underline">
                                {"OPEN"}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Fullfillment"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center">
                              <div className="rounded-md bg-red-400 px-1.5 py-0.5 text-xs leading-none  no-underline group-hover:no-underline">
                                {"NOT FULLFILLMENT"}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div>{"Payment"}</div>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center">
                              <div className="rounded-md bg-red-400 px-1.5 py-0.5 text-xs leading-none  no-underline group-hover:no-underline">
                                {"NOT PAID"}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <Card>
                    <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                      <CardTitle className="text-lg">Customer</CardTitle>
                      {/* <CustomerForm /> */}
                    </CardHeader>
                    <CardContent className="">
                      <p className="font-medium">swiss</p>
                      <p className="">swiss@gmail.com</p>
                      <p className="">0944070021</p>
                    </CardContent>
                  </Card>
                  <div>
                    <Card>
                      <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                        <CardTitle className="text-lg">
                          Payment Mehtod
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="">
                        <p className="">Qr Propmtpay</p>
                        <p className="text-muted-foreground text-xs">
                          CAPTURED: 02/08/2023 @ 4:38 AM
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader className="space-y-1 flex-row  w-full justify-between items-center pb-1">
                      <CardTitle className="text-lg">Address</CardTitle>
                      {/* <AddressForm /> */}
                    </CardHeader>
                    <CardContent className="">
                      <p className="font-medium">swiss</p>
                      <p className="">
                        {`212/393 Pattanakarn Road Praves Praves Bangkok Phone number
                    662 3214368 Zip code 10250 
                    Thailand`}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        </div>
     
      </Container>
      <Footer />
    </div>
  );
}
