import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, _req: Request, res: Response, _next: NextFunction) {
        console.error('❌ Error caught by CustomErrorHandler:', error.stack || error);
        const status = error.httpCode || 500;
        res.status(status).json({
            error: error.name,
            message: error.name + ": " + error.message
        });
    }
}
