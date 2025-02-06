import { H3Event, EventHandlerRequest, createError } from 'h3'; 
import { getServerSession } from '#auth'; 
import { User } from '~/server/models/user';

// Add type definition for session user
interface SessionUser {
  _id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function getUserFromToken(event: H3Event<EventHandlerRequest>) {
  const session = await getServerSession(event);
  
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: No valid session found'
    });
  }

  // Type assertion to use the new SessionUser interface
  const user = await User.findById((session.user as SessionUser)._id);
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'User not found'
    });
  }

  return user;
}
