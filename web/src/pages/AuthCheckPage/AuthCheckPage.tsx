import { useAuth } from 'src/auth'
import { useUser } from '@clerk/clerk-react'
import { MetaTags } from '@redwoodjs/web'
import { useQuery } from '@redwoodjs/web'
import { useEffect } from 'react'

const AUTH_INFO_QUERY = gql`
  query GetAuthInfo {
    authInfo {
      clerk {
        isSignedIn
        clerkId
        sessionId
      }
      user {
        id
        email
        firstName
        lastName
        imageUrl
        roles
        lastLoginAt
        createdAt
        updatedAt
      }
    }
  }
`

const AuthCheckPage = () => {
  const { isAuthenticated, currentUser, loading: authLoading, reauthenticate } = useAuth()
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { loading: queryLoading, data, error } = useQuery(AUTH_INFO_QUERY, {
    skip: !isAuthenticated,
  })

  useEffect(() => {
    console.log('Auth State:', {
      isAuthenticated,
      authLoading,
      clerkLoaded,
      currentUser,
      clerkUser: clerkUser?.id,
    })
  }, [isAuthenticated, authLoading, clerkLoaded, currentUser, clerkUser])

  useEffect(() => {
    // Force a re-authentication check
    const checkAuth = async () => {
      try {
        await reauthenticate()
        console.log('Auth state refreshed:', { 
          isAuthenticated, 
          authLoading, 
          clerkLoaded,
          currentUser: currentUser?.id,
          clerkUser: clerkUser?.id 
        })
      } catch (error) {
        console.error('Auth refresh failed:', error)
      }
    }
    
    checkAuth()
  }, [])

  const loading = authLoading || !clerkLoaded || queryLoading

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1>Loading auth status...</h1>
        </div>
      </div>
    )
  }

  return (
    <>
      <MetaTags title="Auth Check" description="Auth check page" />

      <div className="min-h-screen bg-emerald-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Auth Debug Info
          </h1>

          <div className="mt-10 text-left">
            {/* Clerk Auth Status */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Clerk Auth Status</h2>
              <p className="mb-2">
                <span className="font-semibold">Authentication Status:</span>{' '}
                {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
              </p>
              {isAuthenticated && currentUser && (
                <>
                  <p className="mb-2">
                    <span className="font-semibold">Clerk User ID:</span>{' '}
                    {String(currentUser.id)}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Email:</span>{' '}
                    {clerkUser?.primaryEmailAddress?.emailAddress}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Name:</span>{' '}
                    {clerkUser?.fullName}
                  </p>
                </>
              )}
            </div>

            {/* Database Auth Status */}
            {isAuthenticated && !loading && data && (
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Database User Info</h2>
                <p className="mb-2">
                  <span className="font-semibold">DB User ID:</span>{' '}
                  {data.authInfo.user.id}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Roles:</span>{' '}
                  {data.authInfo.user.roles.join(', ') || 'No roles assigned'}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Last Login:</span>{' '}
                  {data.authInfo.user.lastLoginAt
                    ? new Date(data.authInfo.user.lastLoginAt).toLocaleString()
                    : 'Never'}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Account Created:</span>{' '}
                  {new Date(data.authInfo.user.createdAt).toLocaleString()}
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
                <p className="text-red-600">{error.message}</p>
              </div>
            )}

            {/* Raw Data */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Raw Auth Data:</h2>
              <pre className="bg-white p-4 rounded-lg shadow overflow-auto max-h-96">
                {JSON.stringify(
                  {
                    clerkAuth: {
                      isAuthenticated,
                      currentUser,
                      clerkUser,
                    },
                    databaseAuth: data?.authInfo,
                    error: error?.message,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthCheckPage
