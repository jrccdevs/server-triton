import { pool } from "../db.js";
import nodemailer from "nodemailer";
// import twilio from "twilio";

// Config Twilio (desactivado)
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const crearFactura = async (req, res) => {
  try {
    const { contacto, cart, total, metodo_pago } = req.body;

    // Validaciones básicas
    if (!contacto || typeof contacto !== "object") {
      return res.status(400).json({ message: "Contacto inválido o no enviado" });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Carrito vacío o inválido" });
    }

    if (!total || isNaN(total)) {
      return res.status(400).json({ message: "Total inválido" });
    }

    if (!metodo_pago || typeof metodo_pago !== "string") {
      return res.status(400).json({ message: "Método de pago inválido" });
    }

    console.log("Datos recibidos para factura:", { contacto, cart, total, metodo_pago });

    // 1️⃣ Guardar en la BD
    let facturaId;
    try {
      const [result] = await pool.query(
        "INSERT INTO facturas (contacto_id, total, metodo_pago, productos, fecha) VALUES (?, ?, ?, ?, NOW())",
        [contacto.ci || 0, total, metodo_pago, JSON.stringify(cart)]
      );
      facturaId = result.insertId;
      console.log("Factura insertada con ID:", facturaId);
    } catch (err) {
      console.error("Error insertando en la BD:", err);
      return res.status(500).json({ message: "Error al guardar la factura en la BD" });
    }

    // 2️⃣ Armar detalle de factura
    const detalle = cart
      .map(
        (p) =>
          `- ${p.name} x${p.quantity || 1} = $${(p.price * (p.quantity || 1)).toFixed(2)}`
      )
      .join("\n");

    const facturaTexto = `
🧾 Factura #${facturaId}
-------------------------
Cliente: ${contacto.nombre || "N/A"} ${contacto.apellido || ""}
CI/NIT: ${contacto.ci || "N/A"}
Correo: ${contacto.correo || "N/A"}
Teléfono: ${contacto.telefono || "N/A"}
Método de pago: ${metodo_pago}

Productos:
${detalle}

Total: $${total}
Fecha: ${new Date().toLocaleString()}
`;

    // 3️⃣ Enviar correo
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Tienda Militar" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `Factura #${facturaId}`,
        text: facturaTexto,
      });

      console.log("Correo enviado exitosamente");
    } catch (emailErr) {
      console.error("Error enviando correo:", emailErr);
      // No bloqueamos la factura por error en el correo
    }

    // 4️⃣ (Opcional) WhatsApp - si decides activar más adelante
    /*
    try {
      if (process.env.ADMIN_PHONE) {
        await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
          to: `whatsapp:${process.env.ADMIN_PHONE}`,
          body: facturaTexto,
        });
        console.log("Mensaje WhatsApp enviado");
      }
    } catch (whatsappErr) {
      console.error("Error enviando WhatsApp:", whatsappErr);
    }
    */

    res.json({ message: "Factura generada y enviada", facturaId });
  } catch (error) {
    console.error("Error general creando factura:", error);
    res.status(500).json({ message: "Error inesperado creando factura" });
  }
};
