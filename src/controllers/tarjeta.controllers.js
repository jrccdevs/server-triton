import { pool } from "../db.js";

// Crear una tarjeta de crédito
export const createTarjetaCredito = async (req, res) => {
  try {
    const { contacto_id, numero_tarjeta, fecha_vencimiento, cvv } = req.body;

    const [result] = await pool.query(
      `INSERT INTO tarjeta_credito (contacto_id, numero_tarjeta, fecha_vencimiento, cvv) 
       VALUES (?, ?, ?, ?)`,
      [contacto_id, numero_tarjeta, fecha_vencimiento, cvv]
    );

    res.status(201).json({ id: result.insertId, message: "Tarjeta creada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las tarjetas de crédito
export const getAllTarjetasCredito = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT * FROM tarjeta_credito`);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener tarjetas de crédito por contacto_id
export const getTarjetasByContacto = async (req, res) => {
  try {
    const { contacto_id } = req.params;

    const [result] = await pool.query(
      `SELECT * FROM tarjeta_credito WHERE contacto_id = ?`,
      [contacto_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontraron tarjetas para este contacto" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una tarjeta de crédito
export const updateTarjetaCredito = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_tarjeta, fecha_vencimiento, cvv } = req.body;

    const [result] = await pool.query(
      `UPDATE tarjeta_credito 
       SET numero_tarjeta = ?, fecha_vencimiento = ?, cvv = ? 
       WHERE id = ?`,
      [numero_tarjeta, fecha_vencimiento, cvv, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarjeta no encontrada" });
    }

    res.json({ message: "Tarjeta actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una tarjeta de crédito
export const deleteTarjetaCredito = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(`DELETE FROM tarjeta_credito WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarjeta no encontrada" });
    }

    res.json({ message: "Tarjeta eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
