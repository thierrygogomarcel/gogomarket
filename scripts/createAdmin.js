import { connectDB, disconnectDB } from '../utils/db';
import { User } from '../models/User';
import { hashPassword } from '../utils/auth';

export async function createAdminUser() {
  try {
    // Extraction des valeurs depuis .env
    const {
      ADMIN_EMAIL = 'admin@example.com',
      ADMIN_PASSWORD = 'Admin123!',
      ADMIN_FIRST_NAME = 'Super Administrateur',
      ADMIN_LAST_NAME = 'Système',
      ADMIN_COUNTRY_CODE = '+225',
      ADMIN_PHONE_NUMBER = '0000000000',
    } = process.env;

    const hashedPassword = await hashPassword(ADMIN_PASSWORD);

    // Vérification de l'existence d'un utilisateur admin
    const existingAdmin = await User.findOne({ role: 'superadmin' });
    if (existingAdmin) {
      console.log('Un compte Super administrateur existe déjà.');
      return;
    }

    // Création de l'utilisateur admin
    const admin = await User.create({
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      countryCode: ADMIN_COUNTRY_CODE,
      phoneNumber: ADMIN_PHONE_NUMBER,
      role: 'superadmin',
      status: 'active',
    });

    console.log('Compte Super administrateur créé avec succès :');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Mot de passe: ${ADMIN_PASSWORD}`);
    console.log('Veuillez changer votre mot de passe après la première connexion.');
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur :', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export default createAdminUser;
