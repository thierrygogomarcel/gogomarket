// file: ~/server/api/protected.get.ts
import { getServerSession } from '#auth'
import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    return { status: 'unauthenticated!' }
  }
  return { status: 'authenticated!' }
})