import Container from "@/components/container";
import Billboard from "@/components/billboard";
import NoResults from "@/components/no-result";
import ProductCard from "@/components/product-card";
import Filter from "@/components/filter";
import MobileFilters from "@/components/mobile-filter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const revalidate = 0;

const CategoryPage = ({}) => {
  return (
    <div className="bg-white">
      <Navbar />
      <Container>
        <Billboard />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters sizes={[]} colors={[]} />
            <div className="hidden lg:block">
              <Filter
                valueKey="sizeId"
                name="Categories"
                data={[
                  { id: "23", name: "Men" },
                  { id: "123", name: "Women" },
                  { id: "1234", name: "Kids" },
                  { id: "12345", name: "Jeans" },
                  { id: "123445", name: "Glasses" },
                ]}
              />
              {/* <Filter valueKey="colorId" name="Colors" data={[]} /> */}
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {/* {products.length === 0 && <NoResults />} */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <ProductCard
                  data={{
                    id: "1",
                    name: "Shirt",
                    price: 1000,
                    isFeatured: true,

                    images: [
                      {
                        id: "dfs",
                        url: "data:image/jpeg;base64,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",
                      },
                    ],
                  }}
                />
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
