import Container from "@/components/container"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import WishListItem from "@/components/wishlist/wishlist-item"
import { withUser } from "@/src/hooks/auth/auth-hook"
import { useMyWishlist } from "@/src/hooks/wishlist/queries"

const WishListPage = () => {

    const { data } = useMyWishlist()
    const dataCount = data?.items.length ?? 0
    return (
        <div className="bg-white">
            <Navbar />
            <Container>
                <div className="px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
                    <h1 className="text-2xl font-bold text-black">สินค้าที่อยากได้</h1>
                    <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                        <div className="lg:col-span-12">
                            {dataCount > 0 ? data?.items?.map((item) => (
                                <WishListItem
                                    key={item.item_id}
                                    data={item}
                                />
                            )) : (
                                <Alert className="mt-2">
                                    <AlertDescription className="text-center">
                                        คุณยังไม่มีสินค้าที่อยากได้บ้างเหรอ?
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    )
}
export default WishListPage
export const getServerSideProps = withUser();