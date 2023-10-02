import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WishListService } from "./wishlists.service";
import { GetUserId, Roles } from "@app/common/decorators";
import { AddToWishlistDto } from "./dto/wishlist.dto";
import { RoleFormat } from "@app/common/enums";

@ApiTags('WishList')
@Controller('wishlists')
export class WishListController {
    private readonly logger = new Logger(WishListController.name);

    constructor(
        private readonly wishlistService: WishListService
    ) { }

    @Get()
    getMyWishlists(@GetUserId() userId: string) {
        return this.wishlistService.findWishlistByUserId(userId)
    }

    @Roles(RoleFormat.USER)
    @Get('product/:prod_id')
    getWishlistByProductId(@Param('prod_id') prod_id: string) {
        return this.wishlistService.findWishlistByProductId(prod_id)
    }

    @Post()
    addToWishList(@GetUserId() userId: string, @Body() addToWishlist: AddToWishlistDto) {
        return this.wishlistService.addToWishList(userId, addToWishlist);
    }
}