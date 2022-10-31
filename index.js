const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//async await 
// async function run() {

// }
// run().catch(error => console.error(error));

//user : dbUser2
//password: gIHA6uxLRxMNDuHy

const uri = "mongodb+srv://dbUser2:gIHA6uxLRxMNDuHy@cluster0.5nmtx0a.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollect = client.db('nodeMongoCrud').collection('users');

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollect.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollect.findOne(query);
            res.send(user);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollect.insertOne(user)
            res.send(result)
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollect.updateOne(filter, updatedUser, option);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('Trying to delete', id);
            const query = { _id: ObjectId(id) }
            const result = await userCollect.deleteOne(query);
            console.log(result);
            res.send(result)
        });


        // const user = {
        //     name: 'Sharmin',
        //     email: 'sharmin12@gmail.com'
        // }
        // const result = await userCollect.insertOne(user);
        // console.log(result);
    }
    finally {

    }
}
run().catch(error => console.error(error));


app.get('/', (req, res) => {
    res.send('Hello from node mongo crud server');
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})