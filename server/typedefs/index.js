const typeDefs = `
  type Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type User {
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type LoginRtn {
    token: String
    user: User
  }

  #QUERIES FOR FINDING THINGS
  type Query {
    getSingleUser(id: ID, username: String): User
  }

  #MUTATIONS FOR CHANGING THINGS
  type Mutation {
    createUser(username: String, email: String, password: String!): LoginRtn
    saveBook(user: ID, authors: [String], description: String, bookId: String, image: String, link: String, title: String): User
    deleteBook(user: ID, bookId: ID): User
    login(email: String, username: String, password: String!): LoginRtn
  }
`;

module.exports = { typeDefs };
