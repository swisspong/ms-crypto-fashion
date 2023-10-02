import { getMyWishlist } from "@/src/services/wishlist.service";
import { useQuery } from "@tanstack/react-query";


export const useMyCart = () => {
    return useQuery(["wishlists"], () => getMyWishlist());
};