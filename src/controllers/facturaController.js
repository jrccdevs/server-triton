export const crearFactura = async (req, res) => {
  try {
    const { contacto, cart, total, metodo_pago } = req.body;

    if (!contacto || !cart || cart.length === 0) {
      return res.status(400).json({ message: "Datos incompletos para generar factura" });
    }

    // ⚠️ Usa contacto.id como contacto_id
    const [result] = await pool.query(
      "INSERT INTO facturas (contacto_id, total, metodo_pago, productos, fecha) VALUES (?, ?, ?, ?, NOW())",
      [contacto.id, total, metodo_pago, JSON.stringify(cart)]
    );

    const facturaId = result.insertId;

    // Armar detalle de factura
    const detalle = cart
      .map(p => `- ${p.name} x${p.quantity} = $${(p.price * (p.quantity || 1)).toFixed(2)}`)
      .join("\n");

    const facturaTexto = `
🧾 Factura #${facturaId}
-------------------------
Cliente: ${contacto.nombre} ${contacto.apellido}
CI/NIT: ${contacto.ci || "N/A"}
Correo: ${contacto.correo || "N/A"}
Teléfono: ${contacto.telefono || "N/A"}
Método de pago: ${metodo_pago}

Productos:
${detalle}

Total: $${total}
Fecha: ${new Date().toLocaleString()}
`;

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

    res.json({ message: "Factura generada y enviada", facturaId });
  } catch (error) {
    console.error("Error creando factura:", error);
    res.status(500).json({ message: error.message });
  }
};
