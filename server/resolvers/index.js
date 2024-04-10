// import user model
const { GraphQLError } = require("graphql");
const { User } = require("../models");
// import sign token function from auth
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (_parent, { id, username }, context) => {
      if (!context.user) {
        return new GraphQLError("You need to be logged in to view user info");
      }
      let searchQuery;
      if (id) searchQuery = { _id: id };
      else {
        username.includes("@")
          ? (searchQuery = { email: username })
          : (searchQuery = { username });
      }
      return User.findOne(searchQuery);
    },
  },
  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        return new GraphQLError("Unable to create user");
      }

      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }, context) => {
      const searchQuery = email.includes("@") ? { email } : { username: email };
      const user = await User.findOne(searchQuery);

      if (!user || user == null) {
        throw new GraphQLError("Invalid username/email");
      }

      if (!(await user.isCorrectPassword(password))) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      context.user = user;

      return { token, user };
    },
    saveBook: async (parent, { user, ...body }, context) => {
      if (!context.user) {
        return new GraphQLError("You need to be logged in to save a book");
      }
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        return new GraphQLError(`Unable to save book, ${err.message}`);
      }
    },
    deleteBook: async (parent, { user, bookId }, context) => {
      if (!context.user) {
        return new GraphQLError("You need to be logged in to delete a book");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: user },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return new GraphQLError("Unable to find user to delete book");
      }
      return updatedUser;
    },
  },
};

module.exports = { resolvers };
