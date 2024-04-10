import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($password: String!, $email: String) {
    login(password: $password, email: $email) {
      token
      user {
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($password: String!, $username: String, $email: String) {
    createUser(password: $password, username: $username, email: $email) {
      token
      user {
        username
        email
        savedBooks {
          authors
          description
          bookId
          image
          link
          title
        }
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation SaveBook(
    $authors: [String]!
    $description: String
    $bookId: String!
    $image: String
    $link: String
    $title: String!
    $user: ID
  ) {
    saveBook(
      authors: $authors
      description: $description
      bookId: $bookId
      image: $image
      link: $link
      title: $title
      user: $user
    ) {
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($user: ID, $bookId: ID) {
    deleteBook(user: $user, bookId: $bookId) {
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
