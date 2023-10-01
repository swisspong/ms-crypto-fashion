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

            const { data: product }: { data: Product } = await lastValueFrom(this.productsClient.send({ cmd: 'get_product' }, { prod_id: data.prod_id }));
            this.logger.log("res from product =>", product)
            if (!product) throw new NotFoundException("Product not found.")

            const existIndex = wishlist.items.findIndex(item => {
                if (item.prod_id === product.prod_id) {
                    return true
                }
                return false
            })

            console.log(existIndex);
            if (existIndex < 0) {
                const newItem = new WishListItem()
                newItem.item_id = `item_${this.uid.stamp(15)}`
                newItem.prod_id = product.prod_id
                newItem.description = product.description
                newItem.name = product.name
                newItem.price = product.price
                wishlist.items.push(newItem)
            }else if (existIndex >= 0) {
                wishlist.items = wishlist.items.filter(item => item.prod_id !== data.prod_id);
            }
            
           

            

            const newWishlist = await this.wishListRepository.findOneAndUpdate({ wishl_id:  wishlist.wishl_id}, { items: wishlist.items })
            return newWishlist
        } catch (error) {
            console.log(error);

        }
    }
}