import { Router } from "express";
import {
  createContacto,
  getAllContactos,
  getContactoById,
  updateContacto,
  deleteContacto,
} from "../controllers/contactos.controllers.js";

const router = Router();

// Rutas CRUD
router.post("/contactos", createContacto);        // Crear un contacto
router.get("/contacto", getAllContactos);       // Obtener todos los contactos
router.get("/contactos/:id", getContactoById);   // Obtener un contacto por ID
router.put("/contactos/:id", updateContacto);    // Actualizar un contacto
router.delete("/contactos/:id", deleteContacto); // Eliminar un contacto

export default router;