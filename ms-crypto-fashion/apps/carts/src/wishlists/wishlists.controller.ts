import { Body, Controller, Delete, Get, Logger, Param, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WishListService } from "./wishlists.service";
import { GetUserId, Roles } from "@app/common/decorators";
import { AddToWishlistDto } from "./dto/wishlist.dto";
import { RoleFormat } from "@app/common/enums";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { WISHLIST_DELETE_ITEMS_BY_MERCHANT_ID_EVENT } from "@app/common/constants/carts.constant";
import { IDeleteMerchantId, IDeleteProductId } from "@app/common/interfaces/carts.interface";
import { RmqService } from "@app/common";
import { DeleteManyItemsDto } from "../dto/delet-many-items.dto";

@ApiTags('WishList')
@Controller('wishlists')
export class WishListController {
    private readonly logger = new Logger(WishListController.name);

    constructor(
        private readonly wishlistService: WishListService,
        private readonly rmqService: RmqService,
    ) { }

    @Get()
    getMyWishlists(@GetUserId() userId: string) {
        return this.wishlistService.findWishlistByUserId(userId)
    }


    @Get('product/:prod_id')
    getWishlistByProductId(@Param('prod_id') prod_id: string) {
        return this.wishlistService.findWishlistByProductId(prod_id)
    }

    @Post()
    addToWishList(@GetUserId() userId: string, @Body() addToWishlist: AddToWishlistDto) {
        return this.wishlistService.addToWishList(userId, addToWishlist);
    }

    @Delete()
    removeMany(@GetUserId() userId: string, @Query() items: DeleteManyItemsDto) {
        return this.wishlistService.removeMany(userId, items);
    }

    @EventPattern(WISHLIST_DELETE_ITEMS_BY_MERCHANT_ID_EVENT)
    async removeProduct(@Payload() data: IDeleteMerchantId, @Ctx() context: RmqContext) {
        this.logger.warn("Recevied from WishList")
        await this.wishlistService.deleteMerchantFormWishlistItemEvent(data)
        this.rmqService.ack(context);
    }
}