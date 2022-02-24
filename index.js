const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { query } = require('express');
const { join } = require('path');

const app = express()
const port = 3000

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
  })

  app.get('/books', (req, res) => {
    res.sendFile(path.join(__dirname, '/books.json'))
})

app.get('/new-book', (req, res) => {
    res.sendFile(path.join(__dirname, '/new-book.html'));
})

app.get('/books-list', (req, res) => {
    res.sendFile(path.join(__dirname, '/books.html'))
})

app.get('/book/:id', (req, res) => {
    const id = req.params.id;
    var data = fs.readFileSync("books.json");
    var books = JSON.parse(data);
    
    for (let book of books){
      if (book.isbn === id){
        res.json(book)
        return;
      }
    }
    res.status(404).send('Book not found');
 })

 app.get('/book-search', (req, res) => {
    res.sendFile(path.join(__dirname, '/book-search.html'));
})

 app.get("/search", (req,res) => { 
    myQuery = req.query
    var data = fs.readFileSync("books.json");
    var books = JSON.parse(data);
    let booksQuerry = []

    for(let book of books){
        let flag = true;
        for (let param in myQuery) {

            if (myQuery[param] === ''){
                continue
            }
            else {
                if(myQuery[param] !== book[param]){
                    flag = false
                    break
                }
                else{
                    continue
                }
            }
        }
        if (flag === true){
            booksQuerry.push(book)
        }
    }


    booksQuerry = JSON.stringify(booksQuerry)
    res.send(`${booksQuerry}`);
   }) 

app.post('/new-book', (req, res) => {
    const book = req.body;
  
  var data = fs.readFileSync("books.json");
       var books = JSON.parse(data);

     books.push(book);
      
     var newData = JSON.stringify(books);
     fs.writeFile("books.json", newData, (err) => {
       if (err) {
         console.log(err);
       }
       else { 
         res.send(`${book.title} is added to the database`);
       }
     });
});

app.delete('/book/:isbn', (req, res) => {
    const isbn = req.params.isbn
    let data = fs.readFileSync("books.json");
    let myObject = JSON.parse(data);
    books = myObject.filter(book => {
        if(book.isbn != isbn){
            return true
        }
        return false
    });

    books = JSON.stringify(books);

    fs.writeFile("books.json", books, (err) => {
      if (err) {
        console.log(err);
      }
      else {
        res.send('book deleted');
      }   
    });
});

app.put('/book/:id', (req, res) => {
    const id = req.params.id;
    const modifyBook = req.body;
 
    var data = fs.readFileSync("books.json");
    var books = JSON.parse(data); 
 
    for (let i = 0; i < books.length; i++) {
        if (books[i].isbn == id) {
            books[i] = modifyBook;
        }
    }
 
    books = JSON.stringify(books);
   fs.writeFile("books.json", books, (err) => {
     if (err) {
       console.log(err);
     }
     else {
       res.send('book was edited');
     }
   });
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
