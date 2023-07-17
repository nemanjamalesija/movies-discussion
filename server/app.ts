import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173'];
  const { origin } = req.headers;

  if (allowedOrigins.includes(origin as string)) {
    res.setHeader('Access-Control-Allow-Origin', origin as string);
  }

  next();
});

// static serving
app.use(
  '/public/assets',
  express.static(path.join(__dirName, 'public/assets'))
);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const message = `Can't find ${req.originalUrl} on this server`;
  // const error = new AppError(message, 404);

  // next(error);
});

export default app;
