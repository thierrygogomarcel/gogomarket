import {  defineEventHandler, H3Event } from 'h3'


export default defineEventHandler(async (event) => {
  // Implement your logic to fetch recent products
  // This is a placeholder implementation, replace with your actual database query
  return [
    {
      id: 1,
      name: 'Produit exemple 1',
      price: 29.99,
      imageUrl: '/example-product-1.jpg'
    },
    {
      id: 2,
      name: 'Produit exemple 2',
      price: 49.99,
      imageUrl: '/example-product-2.jpg'
    }
  ]
})
