import { getMyWishlist, getWishlistInfoCsr } from "@/src/services/wishlist.service";
import { useQuery } from "@tanstack/react-query";


export const useMyWishlist = () => {
    return useQuery(["wishlists"], () => getMyWishlist());
};

export const useWishlistInfo = (prod_id: string) => {
    return useQuery(["wishlist", prod_id], () => getWishlistInfoCsr(prod_id),{
        keepPreviousData: true
    });
};