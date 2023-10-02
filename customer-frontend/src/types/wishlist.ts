interface IWishlistPayload {
    prod_id: string
}

interface IWishlistResponse {
    items: IWishlistItem[]
}

interface IWishlistItem {
    item_id: string;
    prod_id: string;
    product: IProductRow;
}

interface ICheckWishList {
    check_wishlist: boolean
}