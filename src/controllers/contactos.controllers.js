import { pool } from "../db.js"; // Importa la conexión a la base de datos

// Crear un contacto
export const createContacto = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono, metodo_pago, ci } = req.body; // 👈 agregamos ci

    if (!nombre || !apellido || !correo || !telefono || !ci) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [resultado] = await pool.query(
      "INSERT INTO contactos(nombre, apellido, correo, telefono, metodo_pago, ci) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, correo, telefono, metodo_pago, ci] // 👈 insertamos ci
    );

    res.status(201).json({
      id: resultado.insertId,
      nombre,
      apellido,
      correo,
      telefono,
      metodo_pago,
      ci
    });
  } catch (error) {
    console.log("Error creando contacto:", error);
    return res.status(500).json({ message: error.message });
  }
};



// Obtener todos los contactos

export const getAllContactos = async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT * FROM contactos`);
    res.json(result);
    console.log(result)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un contacto por ID
export const getContactoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(`SELECT * FROM contactos WHERE id = ?`, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un contacto
export const updateContacto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono, metodo_pago, numero_tarjeta, fecha_vencimiento, cvv } = req.body;

    const [result] = await pool.query(
      `UPDATE contactos 
       SET nombre = ?, apellido = ?, correo = ?, telefono = ?, metodo_pago = ?, numero_tarjeta = ?, fecha_vencimiento = ?, cvv = ? 
       WHERE id = ?`,
      [nombre, apellido, correo, telefono, metodo_pago, numero_tarjeta, fecha_vencimiento, cvv, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.json({ message: 'Contacto actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un contacto
export const deleteContacto = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(`DELETE FROM contactos WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.json({ message: 'Contacto eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
