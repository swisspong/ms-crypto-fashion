import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";
import * as amqp from 'amqplib';

@Injectable()
export class RmqService {
    private listeners: { exchange: string; routingKey: string; callback: (message: any) => void }[] = []
    private readonly logger = new Logger(RmqService.name)
    constructor(private readonly configService: ConfigService) { }

    getOptoins(queue: string, noAck = false): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBIT_MQ_URL')],
                queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
                noAck,
                persistent: true
            }
        }
    }
    ack(context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();
        channel.ack(originalMessage);
    }
   
    
   
    
}