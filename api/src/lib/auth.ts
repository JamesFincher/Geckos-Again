import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'
import { Decoded } from '@redwoodjs/api'
import { db } from './db'
import { logger } from './logger'
import { clerkClient } from '@clerk/clerk-sdk-node'

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY environment variable is not set')
}

export const getCurrentUser = async (decoded: Decoded, { token, type }) => {
  if (!decoded) {
    logger.debug('No decoded JWT payload')
    return null
  }

  const { sub: clerkId, ...rest } = decoded

  logger.debug('getCurrentUser - JWT Payload:', { 
    clerkId, 
    type,
    tokenExists: !!token,
    decodedKeys: Object.keys(rest)
  })

  try {
    logger.debug(`Loading Clerk user: ${clerkId}`)
    const clerkUser = await clerkClient.users.getUser(clerkId)

    if (!clerkUser) {
      logger.error(`No Clerk user found for ID: ${clerkId}`)
      return null
    }

    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress

    if (!primaryEmail) {
      logger.error('No primary email found for user')
      return null
    }

    logger.debug('Clerk user loaded:', { 
      id: clerkUser.id,
      email: primaryEmail,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    })

    logger.debug(`Upserting user with clerkId: ${clerkId}`)
    const dbUser = await db.user.upsert({
      where: { clerkId },
      create: {
        clerkId,
        email: primaryEmail,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        imageUrl: clerkUser.imageUrl || '',
        rolesString: 'USER',
        status: 'ACTIVE',
        lastLoginAt: new Date(),
        loginCount: 1,
        emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
      },
      update: {
        email: primaryEmail,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        imageUrl: clerkUser.imageUrl || '',
        lastLoginAt: new Date(),
        lastActivityAt: new Date(),
        loginCount: { increment: 1 },
        emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
      },
    })

    logger.debug('User synced successfully:', { 
      id: dbUser.id,
      clerkId: dbUser.clerkId,
      roles: dbUser.rolesString
    })

    const user = {
      ...rest,
      ...dbUser,
      roles: dbUser.rolesString.split(','),
      id: dbUser.id,
      clerkId: dbUser.clerkId,
      authenticated: true,
    }

    logger.debug('Final user object:', user)

    return user
  } catch (error) {
    logger.error({ error }, 'Error in getCurrentUser')
    return null
  }
}

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = () => {
  return !!context.currentUser
}

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enums too (if you're using them for roles), just import your enum type from `@prisma/client`
 */
export const hasRole = ({ roles }: { roles: string[] }) => {
  if (!isAuthenticated()) {
    return false
  }

  if (roles) {
    if (Array.isArray(roles)) {
      return context.currentUser?.roles?.some((r) => roles.includes(r))
    }

    return context.currentUser?.roles?.includes(roles)
  }

  return true
}

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = ({ roles } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (roles && !hasRole({ roles })) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
