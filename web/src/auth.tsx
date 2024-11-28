import React, { useEffect } from 'react'
import { ClerkProvider, useUser } from '@clerk/clerk-react'
import { createAuth } from '@redwoodjs/auth-clerk-web'
import { navigate } from '@redwoodjs/router'

export const { AuthProvider: ClerkRwAuthProvider, useAuth } = createAuth()

const ClerkStatusUpdater = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const { reauthenticate } = useAuth()

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && isSignedIn && user) {
        console.log('Starting user sync...', { isLoaded, isSignedIn, userId: user.id })
        try {
          const result = await reauthenticate()
          console.log('User synced successfully', result)
        } catch (error) {
          console.error('Error syncing user:', error)
        }
      }
    }

    syncUser()
  }, [isSignedIn, user, isLoaded, reauthenticate])

  return null
}

export const AuthProvider = ({ children }) => {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error('Missing CLERK_PUBLISHABLE_KEY environment variable')
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={(to) => navigate(to)}
    >
      <ClerkRwAuthProvider>
        <ClerkStatusUpdater />
        {children}
      </ClerkRwAuthProvider>
    </ClerkProvider>
  )
}
