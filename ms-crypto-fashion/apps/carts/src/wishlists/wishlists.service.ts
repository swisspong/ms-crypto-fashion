import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { WishListRepository } from "./wishlists.repository";
import ShortUniqueId from "short-unique-id";
import { AddToWishlistDto } from "./dto/wishlist.dto";
import { ClientProxy } from "@nestjs/microservices";
import { PRODUCTS_SERVICE } from "@app/common/constants/products.constant";
import { lastValueFrom } from "rxjs";
import { Product } from "apps/products/src/schemas/product.schema";
import { WishListItem } from "./schemas/wishlists.schema";
import { IDeleteMerchantId, IDeleteProductId } from "@app/common/interfaces/carts.interface";
import { Types } from "mongoose";
import { CartsRepository } from "../carts.repository";
import { DeleteManyItemsDto } from "../dto/delet-many-items.dto";

@Injectable()
export class WishListService {
    private readonly logger = new Logger(WishListService.name);

    constructor(
        private readonly wishListRepository: WishListRepository,
        private readonly cartsRepository: CartsRepository,
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
            const errorItems: WishListItem[] = []
            wishlist.items = await this.filterItem(errorItems, wishlist.items)
            return { items: wishlist.items, errorItems: errorItems }
        } catch (error) {
            console.log(error);

        }
    }

    async findWishlistByProductId(prod_id: string) {
        try {
            const wishlist = await this.wishListRepository.findOne({
                items: { $elemMatch: { prod_id } }
            })
            return { check_wishlist: wishlist ? true : false };
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async deleteMerchantFormWishlistItemEvent(data: IDeleteMerchantId) {

        const wishlistUpdate = await this.wishListRepository.findAndUpdate
            (
                {
                    "items.product.merchant._id": `${data._id}`
                },
                {
                    $set: {
                        "items.$[elem].product.available": false
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.product.merchant._id": `${data._id}`
                        }
                    ]
                }
            )
        const cartsUpdate = await this.cartsRepository.findAndUpdate
            (
                {
                    "items.product.merchant._id": `${data._id}`
                },
                {
                    $set: {
                        "items.$[elem].product.available": false
                    }
                },
                {
                    arrayFilters: [
                        {
                            "elem.product.merchant._id": `${data._id}`
                        }
                    ]
                }
            )

        this.logger.warn("event delete", wishlistUpdate)
    }

    async removeMany(userId: string, dto: DeleteManyItemsDto) {
        let wishlist = await this.wishListRepository.findOne({ user_id: userId })
        wishlist = wishlist ? wishlist : await this.wishListRepository.create({ user_id: userId, wishl_id: `wishl_${this.uid.stamp(15)}`, items: [] })
        wishlist.items = wishlist.items.filter(item => !dto.items.some(id => id === item.item_id))
        const newWish = await this.wishListRepository.findOneAndUpdate({ wishl_id: wishlist.wishl_id }, { items: wishlist.items })
        return newWish
    }


    filterItem(errorItems: WishListItem[], items: WishListItem[]): WishListItem[] {
        try {
            const correctItems: WishListItem[] = []
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                try {
                    if (!item.product.available) throw new BadRequestException("สินค้านี้ไม่มีอยู่ในร้านค้าแล้ว")
                    correctItems.push(item)
                } catch (error) {
                    const errorItem = items[i]
                    errorItems.push(errorItem)

                }



            }
            return correctItems
        } catch (error) {

        }
    }
}