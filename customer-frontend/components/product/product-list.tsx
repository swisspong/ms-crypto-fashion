import React, { FC } from "react";
import ProductCard from "../product-card";
import { useProducts } from "@/src/hooks/product/user/queries";
import NoResults from "../no-result";
interface Props {
  typeSearch: string;
  search?: string;
  selectedCheckboxes: string[];
}
const ProductList: FC<Props> = ({ typeSearch, search, selectedCheckboxes }) => {
  const dataQuery = useProducts({
    page: 1,
    per_page: 10,
    catIds: selectedCheckboxes,
    type_search: typeSearch,
    search,
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {!dataQuery.data || dataQuery.data.data.length <= 0 ? (
        <NoResults />
      ) : (
        dataQuery?.data?.data.map((product) => (
          <ProductCard
            data={product}
            key={product.prod_id}
            pushUrl={`/storefront/product/${product.prod_id}`}
          />
        ))
      )}
    </div>
  );
};

export default ProductList;
