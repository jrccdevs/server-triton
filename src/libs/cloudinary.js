import { v2 as cloudinary } from "cloudinary";
/* import multer from'multer';
import { CloudinaryStorage } from'multer-storage-cloudinary'; */

import { API_KEY, API_SECRET, CLOUD_NAME } from "../config.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
  
});
 
cloudinary.uploader.upload
/* const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'carpeta-de-almacenamiento-en-cloudinary',
    allowed_formats: ['jpg', 'png'],
    // Ajusta el límite de tamaño aquí (en bytes)
    maxFileSize: 10 * 1024 * 1024,
  },
});

const upload = multer({ storage: storage }); */

const corsOptions = {
  origin: ["https://server-triton.vercel.app/", "http://localhost:3000"], 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

export const uploadImage = async (filePath) => {
  try {
  return await cloudinary.uploader.upload(filePath, {
  //  folder: "AlfaSA",
  folder: "imgtriton",
  });
   } catch (error) {
    console.error("Error al cargar la imagen:", error);
    throw error;  // Re-lanza el error para que pueda ser manejado más arriba
  }
};


export const uploadProspecto = async (filePath) => {
  try {
  return await cloudinary.uploader.upload(filePath, {
  //  folder: "AlfaSA",
  folder: "prospectoAlfaSA",
  });
} catch (error) {
  console.error("Error al cargar la imagen:", error);
  throw error;  // Re-lanza el error para que pueda ser manejado más arriba
}
};


 /*  export const uploadControl = async (filePath) => {
    try {
    return await cloudinary.uploader.upload(filePath, {
    //  folder: "AlfaSA",
    folder: "controlAlfaSA",
    });
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    throw error;  // Re-lanza el error para que pueda ser manejado más arriba
  }
}; */

export const uploadControl = (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { invalidate: true,  folder: "controlAlfaSA" }, (error, result) => {
     
      if (error) {
        console.log('Error al subir a Cloudinary:', error);
        reject(error);
      } else {
        
        console.log('Imagen subida a Cloudinary:', result);
        resolve(result);
      }
      
    });
  });
};


export const deleteImage = async (id) => {
  try {
    return await cloudinary.uploader.destroy(id);
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    throw error;
  }
};

/* export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
} */

/*carga de imagenes del banner personalizado y empresa */

 export const uploadBannerEmpresa = async (filePath) => {
  try {
    return await cloudinary.uploader.upload(filePath, {
    //  folder: "AlfaSA",
    folder: "bannerempAlfaSA",
    allowed_formats: ['jpeg', 'jpg', 'png', 'mp4'],
    });
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    throw error;  // Re-lanza el error para que pueda ser manejado más arriba
  }
};


export const uploadBannerAlfa = async (filePath) => {
  try {
  return await cloudinary.uploader.upload(filePath, {
  //  folder: "AlfaSA",
  folder: "bannerAlfaSA",
  allowed_formats: ['jpeg', 'jpg', 'png', 'mp4'],
  });
} catch (error) {
  console.error("Error al cargar la imagen:", error);
  throw error;  // Re-lanza el error para que pueda ser manejado más arriba
}
};

export const uploadEmpresaAlfa = async (filePath) => {
  try {
  return await cloudinary.uploader.upload(filePath, {
  //  folder: "AlfaSA",
  folder: "empresaAlfaSA",
  allowed_formats: ['jpeg', 'jpg', 'png', 'mp4'],
  });
} catch (error) {
  console.error("Error al cargar la imagen:", error);
  throw error;  // Re-lanza el error para que pueda ser manejado más arriba
}
};