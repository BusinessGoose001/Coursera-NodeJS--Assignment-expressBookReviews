const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "password": "boogers",
    "username": "capt_underpants1"
}];

//Normally would NOT be hard coded but lets do it this way for simplicity
let secret = "NVCsM4sDGs389GdB55T9QEdfgbdfgR8dfgD243SGb43dGB43442TAIssdb8TY045d23UTN26778AssdgfWB2093gbs9qeh83R2HB"
const getUserByUsername = (username) => {
    for (let user of users){
        if (user['username'] == username){
            return user
        }
    }
    return NaN
}
const isValid = (username)=>{ //returns boolean
    let user = getUserByUsername(username) 
    return Boolean(user)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if (!isValid(username)){
        return false
    }
    return getUserByUsername(username)["password"] == password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    if (!(["username", "password"].every(key => req.body.hasOwnProperty(key)))){
        return res.status(400).json({"message": "need both username and password provided", "form": req.body})
    }
    if (authenticatedUser(req.body.username, req.body.password)){
        return res.status(200).json({"jwt":jwt.sign({ username: req.body.username }, secret, { expiresIn: '1h' })})
    }else{
        return res.status(400).json({message: "NOPE!!! WRONG!!!!"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!("username") in req.body){
        res.status(400).json({"message": "please provide your username"})
    }
  if (req.params.isbn in books){
    let book = books[req.params.isbn]
    
    book["reviews"][req.body.username] = req.body.review
  return res.status(200).json({message: "Review posted"});
  }else{
    
    return res.status(400).json({"message": "isbn not found"})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
