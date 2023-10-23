import { SetMetadata } from '@nestjs/common';

export const Duties = (...duties: string[]) => SetMetadata('duties', duties);