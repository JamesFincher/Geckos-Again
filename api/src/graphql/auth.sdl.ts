export const schema = gql`
  enum UserRole {
    USER
    ADMIN
    BREEDER
  }

  type ClerkAuth {
    isSignedIn: Boolean!
    clerkId: String!
    sessionId: String
  }

  type UserAuth {
    id: String!
    clerkId: String!
    email: String!
    firstName: String
    lastName: String
    imageUrl: String
    roles: [UserRole]!
    lastLoginAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type AuthInfo {
    clerk: ClerkAuth
    user: UserAuth
  }

  type Query {
    authInfo: AuthInfo @requireAuth
  }
`