import express from 'express'
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';

import './config.js'
import indexRoutes from './routes/index.routes.js'
//import productosRoutesId from './routes/index.routes.js'
import productosRoutes from './routes/productos.routes.js'
import cors from 'cors'

const app = express();

app.get("/", (req, res)=> {
  res.send("estamos en la pagina de inicio de alfa node");
});
//const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname)
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3000',
      'https://boliviandcode.vercel.app',
      'https://reactaap.vercel.app',
      'https://node-alfa.vercel.app' 

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


//app.use(express.static(join(__dirname, '../client/dist')))
export default app
