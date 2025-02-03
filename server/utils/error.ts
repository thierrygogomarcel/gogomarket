import { H3Error } from 'h3'

export class AppError extends H3Error {
  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.fatal = false
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return createError({
      statusCode: error.statusCode,
      message: error.message
    })
  }

  if (error instanceof Error) {
    return createError({
      statusCode: 500,
      message: error.message
    })
  }

  return createError({
    statusCode: 500,
    message: 'Une erreur inattendue est survenue'
  })
}