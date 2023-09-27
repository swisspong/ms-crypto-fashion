import React, { FC } from "react";
import { Card } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ProductCard from "../product-card";
import MerchantProductList from "./merchant-product-list";
import Link from "next/link";
import { ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
interface Props {
  merchant: IMerchant & {
    products: IProductRow[];
  };
}
const MerchantItem: FC<Props> = ({ merchant }) => {
  return (
    <Card className="flex w-full flex-col col-span-1 p-5 space-x-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 py-1">
          <Avatar className="h-9 w-9">
            <AvatarImage src={merchant.banner_url} alt="@shadcn" />
            <AvatarFallback>
              {merchant?.name
                .split(" ")
                .map((word) => word.substring(0, 1).toUpperCase())
                .filter((word, index) => index <= 1)
                .join("")}
            </AvatarFallback>
          </Avatar>
          {/* <div className="rounded-full h-9 w-9 border"></div> */}
          <p className="font-semibold text-lg">{merchant.name}</p>
        </div>
        <Link href={`merchants/${merchant.mcht_id}`}>
          <Button size={"sm"} variant={"link"}>
            {`เพิ่มเติม`}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <MerchantProductList merchant={merchant} products={merchant.products} />
    </Card>
  );
};

export default MerchantItem;
