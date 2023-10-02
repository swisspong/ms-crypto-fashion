import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { WishListRepository } from "./wishlists.repository";
import ShortUniqueId from "short-unique-id";
import { AddToWishlistDto } from "./dto/wishlist.dto";
import { ClientProxy } from "@nestjs/microservices";
import { PRODUCTS_SERVICE } from "@app/common/constants/products.constant";
import { lastValueFrom } from "rxjs";
import { Product } from "apps/products/src/schemas/product.schema";
import { WishListItem } from "./schemas/wishlists.schema";

@Injectable()
export class WishListService {
    private readonly logger = new Logger(WishListService.name);

    constructor(
        private readonly wishListRepository: WishListRepository,
        @Inject(PRODUCTS_SERVICE) private readonly productsClient: ClientProxy,
    ) { }

    private readonly uid = new ShortUniqueId();

    async addToWishList(user_id: string, data: AddToWishlistDto) {
        try {
            let wishlist = await this.wishListRepository.findOne({ user_id })
            wishlist = wishlist ? wishlist : await this.wishListRepository.create({ wishl_id: `wishl_${this.uid.stamp(15)}`, user_id, items: [] })
            if (!wishlist) throw new BadRequestException("Can not add to wishlist.")
            const currentIndex = wishlist.items.findIndex(item => {
                if (item.prod_id === data.prod_id) {
                    return true
                }
                return false
            })

            if (currentIndex >= 0) {
                wishlist.items = wishlist.items.filter(item => item.prod_id !== data.prod_id);
            } else {
                const { data: product }: { data: Product } = await lastValueFrom(this.productsClient.send({ cmd: 'get_product' }, { prod_id: data.prod_id }));
                this.logger.log("res from product =>", product)
                if (!product) throw new NotFoundException("Product not found.")

                const newItem = new WishListItem()
                newItem.item_id = `item_${this.uid.stamp(15)}`
                newItem.prod_id = product.prod_id
                newItem.product = product
                wishlist.items.push(newItem)
            }

            const newWishlist = await this.wishListRepository.findOneAndUpdate({ wishl_id: wishlist.wishl_id }, { items: wishlist.items })
            return newWishlist
        } catch (error) {
            console.log(error);

        }
    }

    async findWishlistByUserId(user_id: string) {
        try {
            let wishlist = await this.wishListRepository.findOne({ user_id })
            wishlist = wishlist ? wishlist : await this.wishListRepository.create({ wishl_id: `wishl_${this.uid.stamp(15)}`, user_id, items: [] })

            return { items: wishlist.items }
        } catch (error) {
            console.log(error);

        }
    }

    async findWishlistByProductId(prod_id: string) {
        try {
            const wishlist = await this.wishListRepository.findOne({
                items: {$elemMatch: {prod_id}}
            })
            return {check_wishlist: wishlist? true: false};
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}