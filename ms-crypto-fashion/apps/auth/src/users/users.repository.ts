import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
// import { AbstractRepository } from '@app/common';
// import { User } from './schemas/user.schema';
import { AbstractRepository } from '@app/common/database/abstract.repository';
import { User } from './schema/user.schema';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}