import { uploadImage, uploadProspecto } from "../libs/cloudinary.js";
import { pool } from "../db.js";
import fs from "fs-extra";


//mostrando todos los productos
export const getProductosTriton = async (req, res) => {
    try {
      const [result] = await pool.query(
        "SELECT * FROM products  ORDER BY name DESC"
      );
      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  //mostrando detalle de producto por ID
export const getProductosTritonId = async (req, res) => {
    // Recogemos un parametro por la url
    const id = req.params.id;
  
    try {
      const [result] = await pool.query(
        `SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        p.main_image,
        p.description,
        
        -- Imágenes del producto por color
        GROUP_CONCAT(DISTINCT CONCAT('Color: ', pi.color, ', URL: ', pi.image_url) SEPARATOR '; ') AS product_images,
        
        -- Miniaturas de colores
        GROUP_CONCAT(DISTINCT CONCAT('Color: ', ci.color, ', Thumbnail: ', ci.color_image_url) SEPARATOR '; ') AS color_thumbnails,
        
        -- Tallas del producto
        GROUP_CONCAT(DISTINCT ps.size ORDER BY ps.size ASC SEPARATOR ', ') AS sizes,
        
        -- Categorías del producto
        GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS categories

      FROM 
        products p

      -- Unir imágenes de productos
      LEFT JOIN product_images pi ON p.id = pi.product_id

      -- Unir miniaturas de colores
      LEFT JOIN color_images ci ON p.id = ci.product_id

      -- Unir tallas de productos
      LEFT JOIN product_sizes ps ON p.id = ps.product_id

      -- Unir la relación entre productos y categorías
      LEFT JOIN product_categories pc ON p.id = pc.product_id

      -- Unir la tabla de categorías
      LEFT JOIN categories c ON pc.category_id = c.id

      -- Filtro por ID del producto
      WHERE p.id = ?

      GROUP BY p.id
    `,
        [id]
      );
      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  //mostrando detalle de producto por formaFarmaceutica
export const getProductosCategoria = async (req, res) => {
    // Recogemos un parametro por la url
    const name = req.params.name;
  console.log(name)
    try {
      const [result] = await pool.query(
        `
      SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        p.main_image,
        p.description
      FROM 
        products p
      INNER JOIN product_categories pc ON p.id = pc.product_id
      INNER JOIN categories c ON pc.category_id = c.id
      WHERE c.name = ?
    `,
        [name]
      );
  
      res.json(result);
      console.log(result)
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  