import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Res, ForbiddenException } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { GetUser, Roles } from '@app/common/decorators';
import { RoleFormat } from '@app/common/enums';
import { Request, Response } from 'express';


@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/assets',
      filename(req, file, callback) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        const filename = `${file.originalname}-${uniqueSuffix}${ext}`
        callback(null, filename)
      },
    })
  }))
  create(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    console.log(req)
    return this.assetsService.create(file);
  }

  @Roles(RoleFormat.MERCHANT)
  @Post("merchant")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/merchant',
      filename(req, file, callback) {
        console.log(file, (req.user as any).merchant)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        console.log(file.originalname, file.originalname.substring(0, file.originalname.length - ext.length))

        // const filename = `${file.originalname}-${uniqueSuffix}${ext}`
        const filename = `${uniqueSuffix}-${(req.user as any).merchant}-${file.originalname.substring(0, file.originalname.length - ext.length)}${ext}`
        callback(null, filename)
      },
    })
  }))
  createMerchantAsset(@UploadedFile() file: Express.Multer.File) {
    return this.assetsService.createMerchant(file);
  }

  @Roles(RoleFormat.MERCHANT)
  @Post("banner")
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/banner',
      filename(req, file, callback) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        const filename = `${file.originalname}-${uniqueSuffix}${ext}`
        callback(null, filename)
      },
    })
  }))
  createBannerAsset(@UploadedFile() file: Express.Multer.File) {
    return this.assetsService.createBanner(file);
  }

  @Roles(RoleFormat.MERCHANT, RoleFormat.ADMIN)
  @Get('citizen-card/:filename')
  getCitizenImage(@GetUser('merchant') merchantId: string | undefined, @GetUser('role') role: RoleFormat, @Param('filename') filename: string, @Res({ passthrough: true }) res: Response) {
    if (role === RoleFormat.MERCHANT) {
      if (!filename.includes(merchantId)) {
        throw new ForbiddenException()
      }
    }
    return this.assetsService.getImageCitizenCard(filename, res)
  }

}
