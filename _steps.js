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
    
*/