import { API, SERVICE_FORMAT, dynamicApi } from "@/lib/utils";

const api = dynamicApi({ ssr: false, service: SERVICE_FORMAT.WISHLIST })
export const postWishList = async (body: IWishlistPayload): Promise<void> => {
    await api.post(`/wishlists`, body).then(
        (response) => response.data
    );
};