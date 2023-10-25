import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useMyCart } from "@/src/hooks/cart/queries";
import { Checkbox } from "../ui/checkbox";
import {
  Bitcoin,
  ChevronDown,
  CreditCard,
  Minus,
  Plus,
  Store,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { PaymentMethodFormat } from "@/src/types/enums/product";
import { Button } from "../ui/button";

const CartDataTable = () => {
  const { data } = useMyCart();
  return (
    <div>
      <div className="rounded-md border mb-4">
        <div className="flex justify-between items-center pb-2 pt-4 px-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            ตะกร้าสินค้า
          </h3>
          {/* <DataTableViewOptions table={table} /> */}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>สินค้า</TableHead>
              <TableHead>รายละเอียด</TableHead>

              <TableHead>ราคา</TableHead>
              <TableHead>รวม</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.items.length ? (
              data.items.map((item) => (
                <TableRow key={item.item_id} className="">
                  <TableCell className="h-24 w-5">
                    <Checkbox />
                  </TableCell>
                  <TableCell className="h-24 w-24 space-y-1 align-top">
                    <div className="flex items-center space-x-2 border p-1 rounded-md  w-24 sm:w-28">
                      <Store size={15} />
                      <span className="text-sm truncate">
                        {item.product?.merchant.name}
                      </span>
                    </div>
                    <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-28 sm:w-28 border">
                      <img
                        src={
                          (item.vrnt_id
                            ? item.product.variants.find(
                                (vrnt) => vrnt.vrnt_id === item.vrnt_id
                              )?.image_url
                              ? item.product.variants.find(
                                  (vrnt) => vrnt.vrnt_id === item.vrnt_id
                                )?.image_url
                              : item.product.image_urls[0]
                            : item.product.image_urls[0]) as string
                        }
                        alt=""
                        className="object-cover object-center"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-y-1 flex-col justify-center">
                      <p className="text-sm font-medium leading-none">
                        {item.product.name}
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        <p className="cursor-pointer text-xs rounded-sm line-clamp-2">
                          <span className="flex items-center">
                            ตัวเลือก <ChevronDown size={10} />
                          </span>
                          red, blue, green, yellow ,lg ,txl, green, yellow ,lg
                          fdasfsaf ,txl
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center space-x-2">
                        <p className=" border rounded-md p-1 cursor-pointer">
                          <Plus className="h-4 w-4 " />
                        </p>
                        <span>{item.quantity}</span>
                        <p className=" border rounded-md p-1 cursor-pointer">
                          <Minus className="h-4 w-4 cursor-pointer" />
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <span className="font-medium text-xs">
                          การชำระเงิน:
                        </span>
                        {item.product.payment_methods.map((payment,index) =>
                          payment === PaymentMethodFormat.CREDIT ? (
                            <CreditCard size={15}  key={index}/>
                          ) : (
                            <Bitcoin size={15} key={index}/>
                          )
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium leading-none whitespace-nowrap">
                      ฿{item.product.price}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium leading-none whitespace-nowrap">
                      ฿{item.quantity * item.product.price}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  // colSpan={columns.length}
                  className="h-24 text-center"
                >
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CartDataTable;
