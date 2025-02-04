export const validateImage = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return false
    }
  
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return false
    }
  
    return true
  }
  
  export const getDefaultImage = (type: string): string => {
    const defaults: Record<string, string> = {
      profile: 'https://img.freepik.com/free-photo/african-american-business-man-working-laptop-computer-office_1303-15719.jpg',
      product: 'https://via.placeholder.com/300x200?text=Product',
      category: 'https://via.placeholder.com/300x200?text=Category'
    }
    return defaults[type] || defaults.product
  }