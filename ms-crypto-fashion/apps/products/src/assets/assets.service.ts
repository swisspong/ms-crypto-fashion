import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  create(file: Express.Multer.File) {
    return { image_url: "http://api.example.com/assets/" + file.filename }
  }
  createMerchant(file: Express.Multer.File) {
    return { image_url: "http://localhost:5000/merchant/" + file.filename }
  }
  createBanner(file: Express.Multer.File) {
    return { image_url: "http://localhost:5000/banner/" + file.filename }
  }
}
