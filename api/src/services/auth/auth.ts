import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'
import { logger } from 'src/lib/logger'

export const authInfo = async () => {
  requireAuth()

  const { currentUser } = context

  logger.debug('Auth Info Service - Current User:', {
    id: currentUser?.id,
    clerkId: currentUser?.clerkId,
    authenticated: currentUser?.authenticated,
    roles: currentUser?.roles
  })

  if (!currentUser?.clerkId) {
    logger.error('No clerkId found in currentUser')
    return null
  }

  try {
    const dbUser = await db.user.findUnique({
      where: { clerkId: currentUser.clerkId },
    })

    logger.debug('Auth Info Service - DB User:', {
      id: dbUser?.id,
      clerkId: dbUser?.clerkId,
      email: dbUser?.email,
      roles: dbUser?.rolesString
    })

    if (!dbUser) {
      logger.error(`No database user found for clerkId: ${currentUser.clerkId}`)
      return null
    }

    const response = {
      clerk: {
        isSignedIn: true,
        clerkId: currentUser.clerkId,
        sessionId: context.sessionId,
      },
      user: {
        ...dbUser,
        roles: dbUser.rolesString.split(','),
      },
    }

    logger.debug('Auth Info Service - Response:', response)

    return response
  } catch (error) {
    logger.error({ error }, 'Error in authInfo service')
    throw error
  }
}