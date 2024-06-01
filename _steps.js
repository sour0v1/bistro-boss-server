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

/* 
steps to secure api by jwt
---------backend side-----------
installation and set up
 1.go to jwt.io
 2.select node js and go to jwt github repository
 3.install jwt
 4.set const jwt = require('jsonwebtoken') on top

 create secret token
 1.open terminal
 2.command = node > require('crypto').randomBytes(64) > require('crypto').randomBytes(64).toString('hex')
 3.copy secret token and put into .env file
 
 usage
 1.create an api for jwt
   app.post('/jwt', async(req, res) =>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
                expiresIn : '1h'
            })
            res.send({token});
        })
 -----------client side-------------     
 1.do post request from client side(AuthProvider) and get token as response result
 2.save token in the local storage
 3.send token to the backend by axios headers : 
   const res = await axiosSecure.get('/users', {
                headers : {
                    authorization : `Bearer ${localStorage.getItem('access-token')}`
                }
            });
 -------------note - use custom hook----------
 import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000'
})

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const {logOut} = useContext(AuthContext);
    // interceptor for request
    axiosSecure.interceptors.request.use(function (config) {
        const token = localStorage.getItem('access-token');
        console.log('request stop by interceptor', token);
        config.headers.authorization = `Bearer ${token}`
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    })
    // interceptor for response
    axiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async (error) => {
        // console.log('error in the interceptor - ', error);
        const status = error.response.status;
        console.log(status);
        if(status === 401 || status === 403){
            await logOut();
            navigate('/login');
        }
        return Promise.reject(error);
    })
    return axiosSecure
};

export default useAxiosSecure;
 
 4.verify to token from the backend by middleware
    // middlewares
        const verifyToken = (req, res, next) =>{
            // console.log(req.headers);
            console.log('received - ',req.headers.authorization);
            if(!req.headers.authorization){
               return res.status(401).send({ message : 'forbidden access'})
            }
            const token = req.headers.authorization.split(' ')[1];
            console.log('token - ', token);
            console.log('secret - ', process.env.ACCESS_SECRET_TOKEN)
            jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded) =>{
                if(err){
                   return res.status(401).send({message : 'forbidden accessdfsef'})
                }
                req.decoded = decoded;
                next();
            })
        }
 5.                  

*/