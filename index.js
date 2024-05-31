const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

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

        app.get('/menu', async(req, res) =>{
            const result = await menuCollection.find().toArray();
            res.send(result);
        })
        app.get('/reviews', async(req, res) =>{
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })
        app.get('/menu-item',  async(req, res) =>{
            const itemCategory = req.query.category;
            const query = {category : itemCategory}
            const result = await menuCollection.find(query).toArray();
            res.send(result)
            // console.log(category);
        })
        app.get('/users', async(req, res) =>{
            const result = await userCollection.find().toArray();
            res.send(result);
        })
        app.get('/carts', async(req, res) =>{
            const userEmail = req.query.email;
            // console.log(userEmail)
            const query = {email : userEmail}
            const result = await menuItemCollection.find(query).toArray();
            res.send(result);
        })
        app.delete('/users/:id', async(req, res) =>{
            const id = req.params.id;
            // console.log(id)
            const query = {_id : new ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/cart', async(req, res) =>{
            const item = req.body;
            // console.log(item);
            const result = await menuItemCollection.insertOne(item);
            res.send(result);
        })
        app.post('/users', async(req, res) =>{
            const userInfo = req.body;
            // console.log(item);
            // insert user info if user doesn't exist
            // you can do this in many way 1.unique email, 2.upsert, 3. simple checking
            const query = {email : userInfo.email}
            const existingUser = await userCollection.findOne(query);
            if(existingUser){
                return res.send({message : 'user already exist', insertedId : null})
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
