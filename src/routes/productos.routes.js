import { Router } from "express";
import {
    getProductosTriton,
    getProductosTritonId,
    getProductosCategoria,
    getProductosPorNombre
  
  } from "../controllers/productos.controllers.js";
 // import {authenticacion} from '../controllers/authenticacion.controllers.js'

const router = Router();
// mostrando todos los productos

router.get("/productos", getProductosTriton);
router.get("/productos/:id", getProductosTritonId);
router.get("/categorias/:name", getProductosCategoria);
router.get("/producto", getProductosPorNombre);
// router.get("/forma", getForma);

//router.get("/formaFarmaceutica", getFormaFarma);
//router.get("/formaFarmaceutica/:categoria", getProductosCate);













export default router;