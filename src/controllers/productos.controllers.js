import { uploadImage, uploadProspecto } from "../libs/cloudinary.js";
import { pool } from "../db.js";
import fs from "fs-extra";

export const getProductosPorNombre = async (req, res) => {
  try {
    const { name } = req.query; // Obtiene el parámetro 'name' de la query

    if (!name) {
      return res.status(400).json({ error: 'El parámetro "name" es obligatorio.' });
    }

    // Ejecuta la consulta con el parámetro 'name' rodeado de '%' para buscar productos con el mismo nombre
    const [result] = await pool.query(
      "SELECT * FROM products WHERE name LIKE ?", 
      [`%${name}%`] // Pasa el nombre con '%' alrededor
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos con ese nombre.' });
    }

    // Devuelve los productos encontrados
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
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


  export const getTritonId = async (req, res) => {
    // Recogemos un parametro por la url
    const id = req.params.id;
  
    try {
      const [result] = await pool.query(
        `SELECT 
        p.id AS product_id,
        p.name AS product_name,
        p.price,
        p.description,
        
        -- Todas las imágenes del producto (principal y adicionales)
        GROUP_CONCAT(DISTINCT IFNULL(pi.image_url, p.main_image) SEPARATOR '; ') AS all_images,
        
        -- Tallas del producto
        GROUP_CONCAT(DISTINCT ps.size ORDER BY ps.size ASC SEPARATOR ', ') AS sizes
    
    FROM 
        products p
    
    -- Unir imágenes adicionales de productos
    LEFT JOIN product_images pi ON p.id = pi.product_id
    
    -- Unir tallas de productos
    LEFT JOIN product_sizes ps ON p.id = ps.product_id
    
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

