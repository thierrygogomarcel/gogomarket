import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Map of technical errors to user-friendly messages
const errorMessages: Record<string, string> = {
  'auth/invalid-credentials': 'Email ou mot de passe incorrect. Veuillez réessayer.',
  'auth/user-not-found': 'Aucun compte trouvé avec cet email.',
  'auth/wrong-password': 'Mot de passe incorrect. Veuillez réessayer.',
  'auth/email-already-in-use': 'Un compte existe déjà avec cet email.',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
  'auth/invalid-email': 'L\'adresse email n\'est pas valide.',
  'auth/user-disabled': 'Ce compte a été désactivé. Contactez le support.',
  '401': 'Votre session a expiré. Veuillez vous reconnecter.',
  '403': 'Vous n\'avez pas les permissions nécessaires pour cette action.',
  '404': 'La ressource demandée n\'existe pas.',
  '500': 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
  'network-error': 'Impossible de se connecter au serveur. Vérifiez votre connexion.',
  'default': 'Une erreur s\'est produite. Veuillez réessayer.'
}

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored'
    })
  }

  const error = (errorCode: string | Error) => {
    let message: string
    
    if (errorCode instanceof Error) {
      // Try to extract error code from error message
      const code = errorCode.message.split('/')[1] || 'default'
      message = errorMessages[code] || errorMessages.default
    } else {
      message = errorMessages[errorCode] || errorMessages.default
    }

    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored'
    })
  }

  const info = (message: string) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored'
    })
  }

  return {
    success,
    error,
    info
  }
}