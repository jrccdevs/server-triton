


import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 5000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";



export const JWT_SECRETO = process.env.JWT_SECRETO;
export const JWT_TIEMPO_EXPIRA = process.env.JWT_TIEMPO_EXPIRA;
export const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES;

export const DB_DATABASE = process.env.DB_DATABASE || "military_triton";
export const DB_PORT = process.env.DB_PORT || 3306;


export const API_KEY = process.env.API_KEY
export const API_SECRET = process.env.API_SECRET
export const CLOUD_NAME = process.env.CLOUD_NAME