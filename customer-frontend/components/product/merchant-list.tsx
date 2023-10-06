import React, { FC } from "react";
import { Card } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ProductCard from "../product-card";
import MerchantItem from "./merchant-item";
import { useProductsMerchants } from "@/src/hooks/product/user/queries";
import NoResults from "../no-result";
interface Props {
  type: string;
  search?: string;
  selectedCheckboxes: string[];
  selectType: string | undefined;
}
const MerchantList: FC<Props> = ({
  type,
  selectedCheckboxes,
  search,
  selectType,
}) => {
  const merchants = useProductsMerchants({
    page: 1,
    per_page: 10,
    catIds: selectedCheckboxes,
    type: type,
    search,
    type_search: selectType,
  });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {!merchants.data || merchants.data.data.length <= 0 ? (
        <div className="col-span-1 lg:col-span-2">

          <NoResults />
        </div>
      ) : (
        merchants?.data?.data.map((merchant) => <MerchantItem merchant={merchant}/>)
      )}
      {/* <MerchantItem /> */}
    </div>
  );
};

export default MerchantList;
