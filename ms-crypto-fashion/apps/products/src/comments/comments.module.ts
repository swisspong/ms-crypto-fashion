import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CommentsRepository } from './comments.repository';
import { RmqModule } from '@app/common';
import { ORDER_SERVICE } from '@app/common/constants/order.constant';
import { RatingMerchant, RatingMerchantSchema } from './schemas/ratingmerchant.schema';
import { RatingMerchantRepository } from './ratingmerchant.repository';

@Module({
  imports: [
    RmqModule.register({ name: ORDER_SERVICE }),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: RatingMerchant.name, schema: RatingMerchantSchema }])
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, RatingMerchantRepository],
  exports: [CommentsRepository, RatingMerchantRepository]
})
export class CommentsModule { }
