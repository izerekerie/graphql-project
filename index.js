const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://izereuwonkundakelia:IlcafsyJos92bwDR@cluster0.ldbp8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Define your type definitions (schema)
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    createBook(title: String!, author: String!): Book
    updateBook(id: ID!, title: String!, author: String!): Book
    deleteBook(id: ID!): Book
  }
`;

// In-memory book array (mock data)
const books = [
  { id: '1', title: 'The Awakening', author: 'Kate Chopin' },
  { id: '2', title: 'City of Glass', author: 'Paul Auster' }
];

// Define resolvers for your queries and mutations
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, { id }) => books.find(book => book.id === id),
  },

  Mutation: {
    createBook: (parent, { title, author }) => {
      const newBook = { id: String(books.length + 1), title, author };
      books.push(newBook);
      return newBook;
    },
    updateBook: (parent, { id, title, author }) => {
      const book = books.find(book => book.id === id);
      if (!book) {
        throw new Error('Book not found');
      }
      book.title = title;
      book.author = author;
      return book;
    },
    deleteBook: (parent, { id }) => {
      const bookIndex = books.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error('Book not found');
      }
      const deletedBook = books.splice(bookIndex, 1)[0];
      return deletedBook;
    }
  }
};

// Function to start Apollo Server
async function startServer() {
  const app = express();

  // Initialize ApolloServer with typeDefs and resolvers
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Await server start
  await server.start();

  // Apply Apollo middleware to the Express app
  server.applyMiddleware({ app });

  // Start the Express server
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

// Call the function to start the server
startServer();
