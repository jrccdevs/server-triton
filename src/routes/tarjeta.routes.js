import { Router } from "express";
import {
  createTarjetaCredito,
  getAllTarjetasCredito,
  getTarjetasByContacto,
  updateTarjetaCredito,
  deleteTarjetaCredito,
} from "../controllers/tarjeta.controllers.js";

const router = Router();

// Rutas CRUD
router.post("/tarjetas", createTarjetaCredito);               // Crear una tarjeta
router.get("/tarjetas", getAllTarjetasCredito);              // Obtener todas las tarjetas
router.get("/tarjetas/contacto/:contacto_id", getTarjetasByContacto); // Obtener tarjetas por contacto_id
router.put("/tarjetas/:id", updateTarjetaCredito);           // Actualizar una tarjeta
router.delete("/tarjetas/:id", deleteTarjetaCredito);        // Eliminar una tarjeta

export default router;
