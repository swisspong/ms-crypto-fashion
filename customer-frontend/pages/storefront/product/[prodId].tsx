import Container from "@/components/container";
import Footer from "@/components/footer";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import Navbar from "@/components/navbar";
import ProductList from "@/components/product-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOneProductStorefront } from "@/src/hooks/product/merchant/queries";
import { Terminal } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
// import Gallery from '@/components/gallery';
// import Info from '@/components/info';
// import getProduct from '@/actions/get-product';
// import getProducts from '@/actions/get-products';
// import Container from '@/components/ui/container';

const ProductStorefrontPage = () => {
  const router = useRouter();
  const { data } = useOneProductStorefront(router.query.prodId as string);
  const [vrntSelected, setVrntSelected] = useState<string | undefined>();
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Alert className="col-span-2 mb-10 flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={data?.merchant?.banner_url} alt="@shadcn" />
                <AvatarFallback>
                  {data?.merchant?.name
                    .split(" ")
                    .map((word) => word.substring(0, 1).toUpperCase())
                    .filter((word, index) => index <= 1)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {/* <Terminal className="h-4 w-4" /> */}
              <div>
                <AlertTitle className="underline">
                  {data?.merchant.name}
                </AlertTitle>
                <AlertDescription>
                  {data?.merchant.banner_title}
                </AlertDescription>
              </div>
            </Alert>
            <Gallery
              images={[
                // {
                //   id: "dfs",
                //   url: "data:image/jpeg;base64,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",
                // },
                // {
                //   id: "dfsfds",
                //   url: "data:image/jpeg;base64,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",
                // },
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
              // vrntSelected={data?.variants.find(variant=>variant.variant_selecteds.every(vrnts=>))}
            />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info
                data={data}
                vrntIdHandler={(data?: string) => {
                  setVrntSelected(data);
                }}
                wishlist={undefined}
                vrntId={vrntSelected}
                canAddToCart={undefined}
              />
            </div>
          </div>
          <hr className="my-10" />
          {/* <ProductList title="Related Items" items={suggestedProducts} /> */}
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default ProductStorefrontPage;
