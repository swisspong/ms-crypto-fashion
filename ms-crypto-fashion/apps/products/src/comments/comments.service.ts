import { BadRequestException, HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import ShortUniqueId from 'short-unique-id';
import { CommentsRepository } from './comments.repository';
import { ProductsRepository } from '../products.repository';
import { ClientProxy } from '@nestjs/microservices';
import { FINDONE_ORDER_EVENT, ORDER_SERVICE, UPDATEREVIEW_ORDER_EVENT } from '@app/common/constants/order.constant';
import { lastValueFrom } from 'rxjs';
import { ReviewFormat } from 'apps/orders/src/schemas/order.schema';
import { UpdateStatusOrder } from '@app/common/interfaces/order-event.interface';
interface comment {
  comment_id: string
  user_id: string
  prod_id: string
  order_id: string
  text: string
  rating: number
  user_name: string
}

@Injectable()
export class CommentsService {
  private readonly uid = new ShortUniqueId()
  private readonly logger = new Logger(CommentsService.name);
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
    private readonly commentRepository: CommentsRepository,
  ) { }

  async create(user_id: string, createCommentDto: CreateCommentDto) {
    try {
      const { comments, order_id, user_name } = createCommentDto
      // ! Check status order | if status paid == true

      // // return data from order service
      // const order = await lastValueFrom(
      //   this.orderClient.send(FINDONE_ORDER_EVENT, { order_id })
      // )
      // // const order = await this.orderRepository.findOne({ order_id })
      // if (!order) throw new BadRequestException("order is empty.")
      // if (order.reviewStatus === ReviewFormat.REVIEWED) throw new BadRequestException('Reviewed.')

      const newComments: comment[] = await comments.map((comment) => {
        const object: comment = {
          comment_id: `comment_${this.uid.stamp(15)}`,
          ...comment,
          user_id: user_id,
          order_id,
          user_name
        }

        return object
      })

    

      // insert comment many
      const result = await this.commentRepository.createMany(newComments)


      // if create success requry update review status order
      if (result) {
        const data: UpdateStatusOrder = {
          order_id,
          review: ReviewFormat.REVIEWED
        }
        await lastValueFrom(
          this.orderClient.emit(UPDATEREVIEW_ORDER_EVENT,data)
        )
      }

      return {message: "success"}

    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async allProductById(prod_id: string) {
    try {
      const comments = await this.commentRepository.aggregate([
        {
          $match: {
            prod_id
          }
        },
        {
          $project: {
            text: 1,
            rating: 1,
            created_at: '$createdAt',
            comment_id: 1,
            message: '$mcht_message',
            user_name: 1
          }
        }
      ])
      console.log("comment ------------");
      
      console.log(comments)

      return comments
    } catch (error) {
      console.log(error)
    }
  }

  async allComment(per_page: number, page: number) {
    try {
      const skip = (Number(page) - 1) * Number(per_page)
      const limit = per_page
      const comments = await this.commentRepository.aggregate([
        
        {
          $lookup: {
            from: "products",
            localField: "prod_id",
            foreignField: "prod_id",
            as: "product"
          },
        },
        {
          $project: {
            user: {
              $arrayElemAt: ["$user", 0]
            },
            product: { $arrayElemAt: ["$product", 0] },
            text: 1,
            rating: 1,
            comment_id: 1,
            message: '$mcht_message',
            user_name: 1
          }
        },
        {
          $skip: skip,
        },
        {
          $limit: limit
        },
      ])

      const total: { totalCount: number }[] = await this.commentRepository.aggregate([

        {
          $count: 'totalCount'
        }

      ])

      let count = 0

      if (total.length > 0) count = total[0].totalCount
      return {
        page: Number(page),
        per_page: Number(per_page),
        total: count,
        total_page: Math.ceil(count / Number(per_page)),
        data: comments,
      };
    } catch (error) {
      console.log(error)
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async updateReplyComment(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const { message } = updateCommentDto
      // update
      const comment = await this.commentRepository.findOneAndUpdate({ comment_id: id }, { $set: { mcht_message: message } })

      return comment
    } catch (error) {
      console.log(error)
    }
  }

  async remove(id: string) {
    try {
      const result = await this.commentRepository.findOneAndDelete({ comment_id: id })
      return result
    } catch (error) {
      console.log(error)
    }
  }
}
