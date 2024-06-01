const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

// middlewares to verify token
const verifyToken = (req, res, next) => {
    // console.log(req.headers);
    // console.log('receivedd - ', req.headers.authorization);
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'forbidden access' })
    }
    const token = req.headers.authorization.split(' ')[1];
    // console.log('token - ', token);
    // console.log('secret - ', process.env.ACCESS_SECRET_TOKEN)
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'forbidden accessdfsef' })
        }
        req.decoded = decoded;
        next();
    })
}


// mongodb connection

// console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhnq0hd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("bistroBoss");
        const menuCollection = database.collection("menu");
        const reviewsCollection = database.collection("reviews");
        const menuItemCollection = database.collection('itemCarts');
        const userCollection = database.collection('users');

        // jwt related api
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
                expiresIn: '1h'
            })
            res.send({ token });
        })
        // verify admin
        const verifyAdmin = async (req, res, next) => {
            const userEmail = req.decoded.email;
            const query = { email: userEmail }
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === 'admin'
            if (!isAdmin) {
                return res.status(401).send({ message: 'unauthorized access' })
            }
            next();

        }
        app.get('/users/admin/:email', verifyToken, verifyAdmin, async (req, res) => {
            // console.log('email - ', req.params.email)
            // console.log('decode - ', req.decoded.email);
            const userEmail = req.params.email;
            // if (userEmail !== req.decoded.email) {
            //     return res.status(401).send({ message: 'unauthorized access' })
            // }
            const query = { email: userEmail }
            const user = await userCollection.findOne(query);
            let isAdmin = false
            if (user) {
                isAdmin = user?.role === 'admin';
            }
            res.send({ isAdmin });

        })
        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })
        app.get('/menu-item', async (req, res) => {
            const itemCategory = req.query.category;
            const query = { category: itemCategory }
            const result = await menuCollection.find(query).toArray();
            res.send(result)
            // console.log(category);
        })
        app.get('/users', verifyToken, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })
        app.get('/carts', async (req, res) => {
            const userEmail = req.query.email;
            // console.log(userEmail)
            const query = { email: userEmail }
            const result = await menuItemCollection.find(query).toArray();
            res.send(result);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })
        app.post('/cart', async (req, res) => {
            const item = req.body;
            // console.log(item);
            const result = await menuItemCollection.insertOne(item);
            res.send(result);
        })
        app.post('/users', async (req, res) => {
            const userInfo = req.body;
            // console.log(item);
            // insert user info if user doesn't exist
            // you can do this in many way 1.unique email, 2.upsert, 3. simple checking
            const query = { email: userInfo.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exist', insertedId: null })
            }
            const result = await userCollection.insertOne(userInfo);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Boss is running.Sorry, Boss is sitting.Haa haa')
})

app.listen(port, () => {
    console.log('Boss is sitting on port ', port);
})
