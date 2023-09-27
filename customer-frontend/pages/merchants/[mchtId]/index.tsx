import Container from "@/components/container";
import Billboard from "@/components/billboard";
import NoResults from "@/components/no-result";
import ProductCard from "@/components/product-card";
import Filter from "@/components/filter";
import MobileFilters from "@/components/mobile-filter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { GetServerSideProps } from "next";
import { getInfoSsr } from "@/src/services/user.service";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import {
  // useMerchantProducts,
  useMyStorefront,
} from "@/src/hooks/product/merchant/queries";
import { PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getMyStoreFront } from "@/src/services/product.service";
import {
  useCategoryByMchtId,
  useMyCagories,
} from "@/src/hooks/category/queries";
import { getMyCategories } from "@/src/services/category.service";
import queryString from "query-string";
import { useSearchParams } from "next/navigation";
import FilterState from "@/components/filterState";
import { useMerchantById } from "@/src/hooks/merchant/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMerchantProducts } from "@/src/hooks/product/user/queries";

export const revalidate = 0;

const CategoryPage = ({}) => {
  const router = useRouter();
  const [search, setSerarch] = useState<string>();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const { data } = useMerchantProducts({
    mchtId: router.query.mchtId as string,
    page: pageIndex + 1,
    per_page: pageSize,
    catIds: selectedCheckboxes,
    search,
  });
  const { data: merchantInfo } = useMerchantById(router.query.mchtId as string);
  // const { data } = useMyStorefront({
  //   page: pageIndex + 1,
  //   per_page: pageSize,
  //   catIds: selectedCheckboxes,
  //   search,
  // });
  // const { data: categories } = useMyCagories({
  //   page: pageIndex + 1,
  //   per_page: pageSize,
  // });
  const { data: categories } = useCategoryByMchtId({
    mchtId: router.query.mchtId as string,
    pagination: { page: pageIndex + 1, per_page: 100 },
  });

  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <Billboard info={merchantInfo} />

        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters sizes={[]} colors={[]} />
            <div className="hidden lg:block">
              <FilterState
                selectedCheckboxes={selectedCheckboxes}
                setSelectedCheckboxes={setSelectedCheckboxes}
                search={search}
                setSerarch={setSerarch}
                valueKey="sizeId"
                name="Categories"
                data={[
                  ...(categories?.data.map((category) => ({
                    id: category.cat_id,
                    name: category.name,
                  })) ?? []),
                ]}
              />
              {/* <Filter valueKey="colorId" name="Colors" data={[]} /> */}
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {/* {products.length === 0 && <NoResults />} */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {!data?.data || (data?.data && data?.data?.length <= 0) ? (
                  <NoResults />
                ) : (
                  data?.data.map((product) => (
                    <ProductCard
                      data={product}
                      key={product.prod_id}
                      pushUrl={`/merchants/${
                        router.query.mchtId as string
                      }/product/${product.prod_id}`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default CategoryPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["me"], () =>
    getInfoSsr(context.req.headers.cookie)
  );
  const me = queryClient.getQueryData(["me"]);
  if (!me) {
    return {
      redirect: {
        destination: `${process.env.HOST_CUSTOMER}/signin`,
        permanent: false,
      },
    };
  }
  
  // console.log(me);
  // if (me && (me as any).role !== "merchant") {
  //   return {
  //     redirect: {
  //       destination: `${process.env.HOST_CUSTOMER}`,
  //       permanent: false,
  //     },
  //   };
  // }




  // await queryClient.prefetchQuery(
  //   ["my-products", { page: 1, per_page: 20 }],
  //   () => getMyStoreFront({ page: 1, per_page: 20, catIds: [] })
  // );
  // await queryClient.prefetchQuery(
  //   ["my-categories", { page: 1, per_page: 100 }],
  //   () => getMyCategories({ page: 1, per_page: 100 })
  // );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
