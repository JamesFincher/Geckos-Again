export const schema = gql`
  type User {
    id: String!
    email: String!
    firstName: String
    lastName: String
    imageUrl: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    user(id: String!): User @requireAuth
    currentUser: User @requireAuth
  }
`