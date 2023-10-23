import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    protected readonly logger = new Logger(LoggerMiddleware.name);
    use(req: Request, res: Response, next: NextFunction) {
        this.logger.warn('Request to -->', req.body);
        next();
    }
}
