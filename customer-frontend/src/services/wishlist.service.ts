import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";
import queryString from "query-string";

const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.WISHLIST })
export const postWishList = async (body: IWishlistPayload): Promise<void> => {
    await api.post(`/wishlists`, body).then(
        (response) => response.data
    );
};

export const getMyWishlist = async (): Promise<IWishlistResponse> => {
    return await api.get(`/wishlists`).then(
        (response) => response.data
    );
};

export const deleteManyItemInWishlist = async (body: IDeleteManyItem): Promise<void> => {
    await api.delete(`/wishlists/?${queryString.stringify({ items: body.items })}`).then(
        (response) => response.data
    );
};


export const getWishlistInfoCsr = async (product_id: string): Promise<ICheckWishList> => {
    return await api.get(`/wishlists/product/${product_id}`).then(
        (response) => {
            return response.data
        }
    );
};