import React, { FC } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ProductCard from "../product-card";
import NoResults from "../no-result";
interface Props {
  products: IProductRow[];
  merchant: IMerchant;
}
const MerchantProductList: FC<Props> = ({ products, merchant }) => {
  return (
    <div className="relative overflow-hidden">
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {products.length <= 0 ? (
            <NoResults />
          ) : (
            products.map((product) => (
              <ProductCard
                className="h-[300px] w-[210px]"
                pushUrl={`/merchants/${merchant.mcht_id}/product/${product.prod_id}`}
                data={product}
              />
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default MerchantProductList;
