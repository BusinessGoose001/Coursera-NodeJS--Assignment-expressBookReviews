const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const crypto = require('crypto')

function getBookByISBN(isbn){
    if (isbn in books){
        let book = books[isbn]
        return book
    }else{
        return NaN
    }
}

public_users.post("/register", (req,res) => {
    if (!(["username", "password"].every(key => req.body.hasOwnProperty(key)))){
        return res.status(400).json({"message": "need both username and password provided", "form": req.body})
    }

    let username = req.body.username

    if(isValid(username)){
        return res.status(400).json({"message": `username ${username} already claimed`})
    }

    let user = {
        "password": req.body.password,
        "username": username
    }


    users.push(user)
    return res.status(200).json({message: "User created", "user": user, "users": users});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  let book = getBookByISBN(isbn)
  if (book){
    res.status(200).json(JSON.stringify(book));
  }
  return res.status(400).json({message: `book with isbn ${isbn} not found`});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author

  authorBooks = {}
  Object.keys(books).forEach( key => {
    if (books[key]["author"] == author){
        authorBooks[key] = books[key]
    }
  })
  return res.status(200).json(JSON.stringify(authorBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title

    titleBooks = {}
    Object.keys(books).forEach( key => {
        if (books[key]["title"] == title){
            titleBooks[key] = books[key]
        }
    })
    return res.status(200).json(JSON.stringify(titleBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = getBookByISBN(req.params.isbn)
  if (book){
    res.status(200).json(JSON.stringify(book["reviews"]));
  }
  return res.status(400).json({message: `book with isbn ${isbn} not found`});
});

module.exports.general = public_users;
