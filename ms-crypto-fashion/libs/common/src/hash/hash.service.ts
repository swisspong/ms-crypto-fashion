
import { Injectable } from "@nestjs/common"
import * as bcrypt from "bcryptjs"
@Injectable()
export class HashService {
    async hashPassword(password: string) {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }
    async comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash)
    }
}