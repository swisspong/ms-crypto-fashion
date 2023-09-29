import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import Omise from "omise";
import { CreateRecipientDto } from "./dto/create-recipient.dto";



@Injectable()
export class OmiseService {
    private readonly logger = new Logger(OmiseService.name)
   
    async createRecipient(payload: CreateRecipientDto) {
        try {
            const response = await axios.post(
                'https://api.omise.co/recipients',
                {
                    // Your request data here
                    //name: 'Somchai Prasert',
                    //email: 'somchai.prasert@example.com',
                    // description: 'Additional information about Somchai Prasert.',
                    type: 'individual',
                    // tax_id: '1234567890',
                    //'bank_account[brand]': 'scb',
                    //'bank_account[number]': 'acc12345',
                    //'bank_account[name]': 'Somchai Prasert',
                    ...payload
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    auth: {
                        username: process.env.OMISE_SECRET_KEY,
                        password: undefined,
                    },
                }
            );
            this.logger.log(response.data)
            return response.data as Omise.Recipients.IRecipient;
        } catch (error) {
            this.logger.error(error)
            throw error
        }

    }
}