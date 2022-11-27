const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middlware
app.use(cors());
app.use(express.json());

// mongodb connection


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfqwiph.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfqwiph.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
    const productCollection = client.db('mobileResell').collection('productCards');

    app.get('/categories/:id', async(req,res)=>{
        const ID =req.params.id
        const query ={id: (ID)}
        const cursor =productCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    })

    }
    finally{
        

    }
}
run().catch(err => console.error(err));

app.get('/',(req,res)=>{
    res.send('server running....')
});

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})