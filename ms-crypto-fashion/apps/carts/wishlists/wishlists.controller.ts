import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { WishListService } from "./wishlists.service";
import { GetUserId } from "@app/common/decorators";
import { AddToWishlistDto } from "./dto/wishlist.dto";

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

    @Post()
    addToWishList(@GetUserId() userId: string, @Body() addToWishlist: AddToWishlistDto) {
        return this.wishlistService.addToWishList(userId, addToWishlist);
    }
}