const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (username && password) {
    // Check if the user already exists
    const userExists = users.find(user => user.username === username);
    if (!userExists) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "Username already taken!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const requested_book = books[isbn]
  if (requested_book) {
      return res.status(300).json(JSON.stringify(requested_book, null, 2));
  } else {
    return res.status(404).json({ message: "Requested book is not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const requested_book = Object.values(books).filter(book => book.author.startsWith(author));
  if (requested_book.length > 0) {
      return res.status(300).json(JSON.stringify(requested_book, null, 2));
  } else {
    return res.status(404).json({ message: "Requested book is not found"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const requested_book = Object.values(books).filter(book => book.title.startsWith(title));
  if (requested_book.length > 0) {
      return res.status(300).json(JSON.stringify(requested_book, null, 2));
  } else {
    return res.status(404).json({ message: "Requested book is not found"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const requested_book = books[isbn]?.reviews;
  if (requested_book) {
      return res.status(300).json(JSON.stringify(requested_book, null, 2));
  } else {
    return res.status(404).json({ message: "Requested book is not found"})
  }
});

module.exports.general = public_users;
