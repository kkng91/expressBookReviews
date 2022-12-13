const express = require('express');
//let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
	const uname = req.body.username;
	const pw = req.body.password;

	if(uname && pw){
		if(isValid(uname)){
         users.push({
            "username": uname,
            "password": pw
         });
         return res.status(200).json({message: "User successfully registred. Now you can login"});
      }else{
         return res.status(404).json({message: "User already exist!"});
      }
	}else{
		return res.status(404).json({message: "Missing username / passowrd"});
	}
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
	let promiseBook = new Promise((resolve, reject) =>{
      resolve(require("./booksdb.js"));
	});

	promiseBook.then((books) => {
		res.status(200).send(JSON.stringify(books, null, 4));
	});  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

   let promiseIsbn = new Promise((resolve, reject) =>{
      let books = require("./booksdb");
      const isbn = req.params.isbn;
      const book = books[isbn];

      if(book){
         resolve(book);
      }else{
         reject("Book not found.");
      }
   });

   promiseIsbn.then((book) => {
      res.status(200).send(book);
   }, (message) => {
      res.status(404).send(message);
   }); 
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
   let promiseBook = new Promise((resolve, reject) =>{
      let books = require("./booksdb");
		const author = req.params.author;
      let book = [];

      Object.keys(books).forEach(k => {
         if(books[k].author == author){
            book.push(books[k]);
         }
		});
      resolve(book);
   });
  
   promiseBook.then((book) => {
      res.status(200).send(book);
   });  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
   let promiseBook = new Promise((resolve, reject) =>{
      let books = require("./booksdb");
      const title = req.params.title;
      let book = [];

      Object.keys(books).forEach(k => {
         if(books[k].title == title){
            book.push(books[k]);
         }
      });  
      resolve(book);
   });

   promiseBook.then((book) => {
      res.status(200).send(book);
   });  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

   let promiseReview = new Promise((resolve, reject) =>{
      let books = require("./booksdb");
      const isbn = req.params.isbn;

      resolve(books[isbn].reviews);
    });

   promiseReview.then((review) =>{
      res.status(200).send(review);
   });
    
});

module.exports.general = public_users;
