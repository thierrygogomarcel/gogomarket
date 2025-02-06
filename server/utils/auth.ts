import { H3Event, EventHandlerRequest } from 'h3'; 
import { getServerSession } from '#auth'; 

export async function getUserFromToken(event: H3Event<EventHandlerRequest>) {
  const session = await getServerSession(event);
  
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: No valid session found'
    });
  }

  return session.user;
}
