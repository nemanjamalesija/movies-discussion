import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

dotenv.config();
const app = express();

/* CONFIG  */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirName, 'public/assets')));

export { app };
