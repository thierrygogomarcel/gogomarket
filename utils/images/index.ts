export function getImageUrl(src?: string, type?: 'product' | 'profile' | 'category' | 'banner'): string {
  // Default fallback image logic
  if (!src) {
    switch (type) {
      case 'product':
        return '/default-product.jpg'
      case 'profile':
        return '/default-profile.jpg'
      case 'category':
        return '/default-category.jpg'
      case 'banner':
        return '/default-banner.jpg'
      default:
        return '/default-image.jpg'
    }
  }
  return src
}

export function handleImageError(event: Event, fallbackType: string | undefined): void {
  const imgElement = event.target as HTMLImageElement
  
  // Determine the type from data attribute or props
  const type = imgElement.getAttribute('data-type') as 
    | 'product' 
    | 'profile' 
    | 'category' 
    | 'banner' 
    | undefined

  // Set fallback image
  imgElement.src = getImageUrl(undefined, type)
}
