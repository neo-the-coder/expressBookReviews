const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "user", password: "123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const validUser = users.find(user => user.username === username && user.password === password)
    return Boolean(validUser)
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        const accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        console.log(req.session.authorization)
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.session.authorization["username"];
  const isbn = req.params?.isbn;
  const review = req.query?.review;
  if (!user || !isbn || !review) {
    return res.status(404).json({ message: "Invalid request"})
  }
  const bookReviewed = books[isbn];
  bookReviewed.reviews[user] = review;
  books[isbn] = bookReviewed
  console.log(books[isbn])
  return res.status(300).json({message: "Review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const user = req.session.authorization["username"];
    const isbn = req.params?.isbn;
    if (!user || !isbn) {
      return res.status(404).json({ message: "Invalid request"})
    }
    const book_reviews = books[isbn]?.reviews;
    if (book_reviews && book_reviews[user]) {
        delete book_reviews[user]
    }
    return res.status(300).json({message: "Review deleted successfully"});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
