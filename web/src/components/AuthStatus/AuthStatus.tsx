import { useAuth } from '@redwoodjs/auth'
import { useQuery } from '@redwoodjs/web'

const AUTH_QUERY = gql`
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

const AuthStatus = () => {
  const { isAuthenticated } = useAuth()
  const { loading, data } = useQuery(AUTH_QUERY, {
    skip: !isAuthenticated,
  })

  if (!isAuthenticated) {
    return <div>Not authenticated</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const { authInfo } = data

  return (
    <div>
      <h2>Auth Status</h2>
      <pre>{JSON.stringify(authInfo, null, 2)}</pre>
    </div>
  )
}

export default AuthStatus