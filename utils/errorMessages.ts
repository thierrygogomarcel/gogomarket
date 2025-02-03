// utils/errorMessages.ts
export const errorMessages = {
    'auth/invalid-credentials': 'Email ou mot de passe incorrect',
    'auth/user-not-found': 'Aucun compte trouvé avec cet email',
    'auth/wrong-password': 'Mot de passe incorrect',
    'auth/email-already-in-use': 'Un compte existe déjà avec cet email',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
    'auth/invalid-email': 'L\'adresse email n\'est pas valide',
    'auth/user-disabled': 'Ce compte a été désactivé. Contactez le support',
    'network-error': 'Erreur de connexion. Vérifiez votre connexion internet',
    'default': 'Une erreur est survenue. Veuillez réessayer'
  }
  
  export const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return errorMessages[error as keyof typeof errorMessages] || errorMessages.default
    }
    
    if (error.code) {
      return errorMessages[error.code as keyof typeof errorMessages] || error.message
    }
    
    return errorMessages.default
  }
  