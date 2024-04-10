import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe($id: ID) {
    getSingleUser(id: $id) {
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
