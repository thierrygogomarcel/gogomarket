import { Product } from '../../models/product';
import { createError, defineEventHandler } from 'h3';
import { requireAuth } from '../../utils/auth';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';

// Définir le dossier de téléchargement
const uploadDir = path.join(process.cwd(), 'public/uploads');

// S'assurer que le dossier de téléchargement existe
async function ensureUploadDirExists() {
  await fs.mkdir(uploadDir, { recursive: true });
}
// await ensureUploadDirExists();

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Définir le dossier de destination
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Générer un nom de fichier unique
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB par fichier
  },
});

// Gestionnaire de téléchargement (permettant plusieurs fichiers)
const uploadMiddleware = upload.array('images', 5); // Jusqu'à 5 fichiers avec le champ `images`

export default defineEventHandler(async (event) => {
  try {
    // Vérification de l'authentification
    const user = await requireAuth(event);

    if (user.userType !== 'producer') {
      throw createError({
        statusCode: 403,
        message: 'Only producers can add products',
      });
    }

    // Cast de `req` et `res` pour utiliser multer
    const req = event.node.req as any;
    const res = event.node.res as any;

    // Utilisation de multer pour gérer les fichiers téléchargés
    const files = await new Promise<Express.Multer.File[]>((resolve, reject) => {
      uploadMiddleware(req, res, (err: any) => {
        if (err) return reject(err);
        resolve(req.files as Express.Multer.File[]);
      });
    });

    // Récupérer les données du formulaire (contenu de `body`)
    const body = req.body;

    // Construire les chemins d'accès aux fichiers uploadés
    const images = files.map((file) => `/uploads/${file.filename}`);

    // Création du produit dans la base de données
    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      category: body.category,
      location: body.location,
      stock: Number(body.stock),
      images,
      sellerId: user.userId,
    });

    return product;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    });
  }
});
