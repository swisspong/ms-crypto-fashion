import { Injectable, Logger } from '@nestjs/common';
import { MerchantsRepository } from '../merchants/merchants.repository';
import { MerchantStatus } from '@app/common/enums';
import { Cron, CronExpression } from '@nestjs/schedule';
import { log } from 'console';
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly merchantRepository: MerchantsRepository
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // @Cron('1 * * * * *')
  async handleCron() {
    this.logger.debug('Called when the current minute is 1');
    const merchants = await this.merchantRepository.aggregate([
      {
        $match: {
          status: MerchantStatus.OPENED
        },
      }
    ])

   
    
    // now date
    const now_date = new Date()
    const filter: Array<{mcht_id: string}> = []
    merchants.forEach(async (merchant) => {
      const mer_end_date = new Date(merchant.end_date)
      const result = now_date.getDate() === mer_end_date.getDate() &&
        now_date.getMonth() === mer_end_date.getMonth() &&
        now_date.getFullYear() === mer_end_date.getFullYear();

      if (result) filter.push({mcht_id: merchant.mcht_id})
    })

    if (filter.length > 0) await this.merchantRepository.findOneAndUpdateMany(filter, { $set: { status: MerchantStatus.APPROVED }})
  }
} 
