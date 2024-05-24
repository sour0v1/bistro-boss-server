/* 
Steps to make express server

In the terminal-----
0.open terminal
1.mkdir project name
2.npm init -y
3.npm i express cors dotenv mongodb
4.open vs code by code .

In the VS code editor-----
5.create index.js file
6.in the index.js file:
    const express = require('express');
    const app = express();
    const cors = require('cors');
    const { MongoClient, ServerApiVersion } = require('mongodb');
    require('dotenv').config()
    const port = process.env.PORT || 5000
    
    // middleware
    app.use(cors());
    app.use(express.json());
    
    app.get('/', (req, res) => {
    res.send('Boss is running.Sorry, Boss is sitting.Haa haa')
    })
     app.listen(port, () => {
    console.log('Boss is sitting on port ', port);
     })
7.connect to the mongodb
8.in the mongodb-----
    1.go to 'database'
    2.click to connect
    3.copy connection string and paste it in the index.js file
    4.go to 'database access'
    5.add new database user
    6.replace the 'username' and 'password' from the connection string
    7.finally operate CRUD operation 
    8.comment out 'await client.close();'
*/