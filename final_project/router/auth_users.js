const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let checkuser = users.filter(u =>{
        return (u.username === username && u.password === password);
    });

    if(checkuser.length>0){
        return true;
    }else{
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const uname = req.body.username;
  const pw = req.body.password;
  if(!uname || !pw){
      return res.status(404).json({"message": "Missing username / password!"});
  }
  if(authenticatedUser(uname, pw) ){
      let accessToken = jwt.sign(
          {"data": pw}, 
          'access', 
          {"expiresIn": 60*60});
      req.session.authorization = {accessToken, uname}  
      return res.status(200).send("User successfully logged in");
  }else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const book = books[isbn];
  const uname = req.session.authorization['uname'];
  
  book.reviews[uname] = review;
  books[isbn] = book;
  return res.status(200).send(`Review of ${book.title} is saved.`);

  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const uname = req.session.authorization['uname'];
    delete (books[isbn].reviews[uname]);
    return res.status(200).send(`Review of ${books[isbn].title} is deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
