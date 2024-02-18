import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { parse } from 'qs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import tourRouter from './routes/tourRouter.mjs';
import userRouter from './routes/userRouter.mjs';
import reviewRouter from './routes/reviewRouter.mjs';

import AppError from './utils/appError.mjs';
import globalErrorHandler from './utils/errorHandler.mjs';

const app = express();

app.set('query parser', function (string) {
  return parse(string, {
    comma: true,
    arrayLimit: 30,
  });
});


app.use(helmet());
app.use(cors());


if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    max: 70,
    windowMs: 15 * 60 * 1000,
    handler(request, response, next) {
      next(new AppError('Too many requests, please try again later!', 421));
    },
  });

  app.use('/api/', limiter);
}

app.use(json({ limit: '20kb' }));


app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);



if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
