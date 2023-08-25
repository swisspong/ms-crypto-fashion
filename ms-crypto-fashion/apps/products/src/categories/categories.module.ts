import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { CategoriesRepository } from './categories.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AUTH_SERVICE } from '@app/common/constants';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryWeb, CategoryWebSchema } from './schemas/category-web.schema';

@Module({
  imports: [
    RmqModule.register({ name: AUTH_SERVICE }),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: CategoryWeb.name, schema: CategoryWebSchema }]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
  ],
})
export class CategoriesModule { }
