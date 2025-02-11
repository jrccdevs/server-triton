import express from 'express'
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import path from "path";

import './config.js'
import indexRoutes from './routes/index.routes.js'
//import productosRoutesId from './routes/index.routes.js'
import productosRoutes from './routes/productos.routes.js'
import contactosRoutes from './routes/contactos.routes.js'
import tarjetaRoutes from './routes/tarjeta.routes.js'
import cors from 'cors'
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

app.use(express.static(path.resolve("./src/public")));
//const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname)
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://boliviandcode.vercel.app',
      'https://reactaap.vercel.app',
      'https://node-alfa.vercel.app', 
      'https://server-triton.vercel.app',
      'https://triton-blue.vercel.app'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(express.json({
  limit: '50mb'
}));
app.use(bodyParser.json());

app.use(
    fileUpload({
      tempFileDir: "./cargarimg",
      useTempFiles: true,
    })
  );
app.use(cookieParser())

app.use(indexRoutes);
app.use(productosRoutes);
app.use(contactosRoutes);
app.use(tarjetaRoutes)
app.use(paymentRoutes);

//app.use(express.static(join(__dirname, '../client/dist')))
export default app
