import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUserId, Public, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@GetUserId() userId: string, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(userId,createCommentDto);
  }

  @Roles(RoleFormat.ADMIN)
  @Get()
  allComment(@Query('per_page') perPage: number, @Query('page') page: number) {
    return this.commentsService.allComment(perPage, page)
  }


  @Public()
  @Get('product/:productId')
  allProductById(@Param('productId') prod_id: string) {
    return this.commentsService.allProductById(prod_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Roles(RoleFormat.MERCHANT)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.updateReplyComment(id, updateCommentDto);
  }

  @Roles(RoleFormat.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
