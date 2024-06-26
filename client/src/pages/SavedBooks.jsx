import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import Auth from "../utils/auth";
import { getSavedBookIds, removeBookId } from "../utils/localStorage";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { DELETE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const [savedBooks, setSavedBooks] = useState([]);

  useEffect(() => {
    setSavedBooks(getSavedBookIds());
  }, []);

  const [getMe] = useLazyQuery(GET_ME, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setUserData(data.getSingleUser);
    },
  });
  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: (data) => {
      removeBookId(data.deleteBook.bookId);
      setUserData(data.deleteBook);
    },
  });

  // use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const loggedInUser = Auth.getProfile();

        await getMe({ variables: { id: loggedInUser.data._id } });
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [savedBooks.length]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    const userProfile = Auth.getProfile();

    try {
      await deleteBook({
        variables: { bookId, user: userProfile.data._id },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
