import FileUploadArr from "@/components/file-upload-arr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import React from "react";
import useProductEditFormHook from "./use-product-edit-hook";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";

const ProductsEditForm = () => {
  const {
    form,
    onSubmit,
    isLoading,
    data,
    items,
    imageRemove,
    catFields,
    dataQeury,
    catRemove,
    catAppend,
    fields,
    categories,
    catLoading,
    append,
    remove,
  } = useProductEditFormHook();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-5 md:col-span-3 grid gap-4">
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
                              isLoading || (data?.variants.length ?? 0) > 0
                            }
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
                            type="number"
                            disabled={
                              isLoading || (data?.variants.length ?? 0) > 0
                            }
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
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
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
          <div className="col-span-5 md:col-span-2 gap-4 flex flex-col">
            <Card className="order-last md:order-first">
              <CardHeader>
                <Button type="submit" disabled={isLoading} className="w-full">
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
            <Card className="">
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
                                .find((cat) => cat.cat_id === item.catweb_id);
                            })
                            .map((item) => (
                              <SelectItem key={item.catweb_id} value={item.catweb_id}>
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
            <Card className="">
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
                        <X className="h-4 w-4" onClick={() => remove(index)} />
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
                            categories?.data.find((cat) => cat.cat_id === val)
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
                                .find((cat) => cat.cat_id === item.cat_id);
                            })
                            .map((item) => (
                              <SelectItem key={item.cat_id} value={item.cat_id}>
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
  );
};

export default ProductsEditForm;
