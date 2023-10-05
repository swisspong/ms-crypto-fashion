import Container from "@/components/container";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import Navbar from "@/components/navbar";
import ProductList from "@/components/product-list";
import { useOneProductStorefront } from "@/src/hooks/product/merchant/queries";
import { useProductById } from "@/src/hooks/product/user/queries";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import Gallery from '@/components/gallery';
// import Info from '@/components/info';
// import getProduct from '@/actions/get-product';
// import getProducts from '@/actions/get-products';
// import Container from '@/components/ui/container';

const ProductStorefrontPage = () => {
  const router = useRouter();
  // const { data } = useOneProductStorefront(router.query.prodId as string);
  const { data, isError } = useProductById(router.query.prodId as string);

  const [vrntSelected, setVrntSelected] = useState<string | undefined>();
 
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery
              images={[
                ...(data?.image_urls.map((image, index) => ({
                  id: index,
                  url: image,
                })) ?? []),
                ...(data?.variants
                  .filter((vrnt) => vrnt.image_url)
                  .map((vrnt) => ({
                    id: vrnt.image_url,
                    url: vrnt.image_url,
                    vrntId: vrnt.vrnt_id,
                  })) ?? []),
              ]}
              vrntSelected={vrntSelected}
            />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={data} setVrntSelected={setVrntSelected} />
            </div>
          </div>
          <hr className="my-10" />
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm font-medium">asdasdasdas</p>
            <p className="text-gray-800 mt-1">asdasdasdasd</p>
          </div>
          {/* <ProductList title="Related Items" items={suggestedProducts} /> */}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ProductStorefrontPage;
