import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name)
  create(file: Express.Multer.File) {
    this.logger.log("form normal asset")

    // return { image_url: "http://api.cryptofashion.store/assets/" + file.filename }
    return { image_url: "http://api.cryptofashion.store/assets/" + file.filename }
  }
  createMerchant(file: Express.Multer.File) {
    this.logger.log("form asset merchant")
    this.logger.log('filename', file.filename)
    // return { image_url: "http://api.example.com/merchant/" + file.filename }


    return { image_url: "http://api.cryptofashion.store/assets/citizen-card/" + file.filename }
  }
  createBanner(file: Express.Multer.File) {

    this.logger.log('filename', file.filename)
    return { image_url: "http://api.cryptofashion.store/banner/" + file.filename }
  }

  async getImageCitizenCard(name: string, res: Response) {
    const imagePath = path.join(__dirname, '../../../../../../../', 'public', 'merchant', name);
    this.logger.log('card image', imagePath)
    if (!fs.existsSync(imagePath)) {
      this.logger.error("not found", fs.existsSync(imagePath))
      throw new NotFoundException('Image not found');
    }
    const imageBinaryData = fs.readFileSync(imagePath);
    // res.setHeader('Content-Type', 'image/jpeg');
    res.end(imageBinaryData);

  }

}
