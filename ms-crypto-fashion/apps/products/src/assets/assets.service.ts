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

    return { image_url: "http://api.example.com/assets/" + file.filename }
  }
  createMerchant(file: Express.Multer.File) {
    this.logger.log("form asset merchant")
    this.logger.log('filename', file.filename)
    // return { image_url: "http://api.example.com/merchant/" + file.filename }


    return { image_url: "http://api.example.com/assets/citizen-card/" + file.filename }
  }
  createBanner(file: Express.Multer.File) {

    this.logger.log('filename', file.filename)
    return { image_url: "http://api.example.com/banner/" + file.filename }
  }

  async getImageCitizenCard(name: string, res: Response) {
    const imagePath = path.join(__dirname, '../../../../../../../', 'public', 'merchant',name);
    this.logger.log('card image', imagePath)
    if (!fs.existsSync(imagePath)) {
      this.logger.error("not found",fs.existsSync(imagePath))
      throw new NotFoundException('Image not found');
    }
    
    // Send the image file as a response
    // res.setHeader('Content-Type', 'image/*');
    // res.sendFile(imagePath);
    

    fs.readdir(imagePath, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
      }
    
      // Iterate through the list of files and log them
      files.forEach((file) => {
        const filePath = path.join(imagePath, file);
        // Check if the item is a file (not a directory)
        if (fs.statSync(filePath).isFile()) {
          console.log(file);
        }
      });
    });
    // return
  }

}
