const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const userInfoCollection = client.db('mobileResell').collection('userInfo');
    const bookingInfoCollection = client.db('mobileResell').collection('bookingInfo');
    const categoryInfoCollection = client.db('mobileResell').collection('categoryInfo');
    const advertisedCollection = client.db('mobileResell').collection('advertisedInfo');

    app.get('/categories/:id', async(req,res)=>{
        const ID =req.params.id
        const query ={id: (ID)}
        const cursor =productCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
    })

    
    

    app.post('/userinfo', async(req, res)=>{
        const userinfo= req.body;
        const result= await userInfoCollection.insertOne(userinfo);
        res.send(result)
    })

    app.post('/bookinginfo', async(req, res)=>{
        const bookinginfo= req.body;
        const result= await bookingInfoCollection.insertOne(bookinginfo);
        res.send(result)
    })
    app.post('/categoriesinfo', async(req, res)=>{
        const categoryinfo= req.body;
        const result= await categoryInfoCollection.insertOne(categoryinfo);
        res.send(result)
    })
    app.post('/productdetails', async(req, res)=>{
        const productDetails= req.body;
        const result= await productCollection.insertOne(productDetails);
        res.send(result)
    })
    app.post('/advertised', async(req, res)=>{
        const advertisedInfo= req.body;
        const result= await advertisedCollection.insertOne(advertisedInfo);
        res.send(result)
    })
    app.put('/verify/:email', async(req, res)=>{
        const email= req.params.email;
        const  query ={email: (email)};
        const options = {upsert: true};
        const updatedDoc = {
            $set: {
                isverified: 'verified'
            }
        }
        const result= await productCollection.updateMany(query, updatedDoc, options);
        res.send(result)
    })
    app.get('/categories', async(req,res)=>{
        const query ={}
        const cursor =categoryInfoCollection.find(query);
        const advertisedProducts = await cursor.toArray();
        res.send(advertisedProducts);
    })
    app.get('/advertisedProducts', async(req,res)=>{
        const query ={}
        const cursor =advertisedCollection.find(query);
        const advertisedProducts = await cursor.toArray();
        res.send(advertisedProducts);
    })
    
    app.get('/dashboard/:uid', async(req,res)=>{
        const uid =req.params.uid
        const query ={uid: (uid)}
        const cursor =bookingInfoCollection.find(query);
        const bookingInfo = await cursor.toArray();
        res.send(bookingInfo);
    })
    app.get('/myproducts/:uid', async(req,res)=>{
        const uid =req.params.uid
        const query ={uid: (uid)}
        const cursor =productCollection.find(query);
        const myproducts = await cursor.toArray();
        res.send(myproducts);
    })
    

    app.get('/buyer/:email', async(req,res)=>{
        const email = req.params.email
        const query ={email}
        const user = await userInfoCollection.findOne(query);
        res.send({isBuyer: user?.role === 'Buyer'});
    })
    app.get('/admin/:email', async(req,res)=>{
        const email = req.params.email
        const query ={email}
        const user = await userInfoCollection.findOne(query);
        res.send({isAdmin: user?.role === 'Admin'});
    })
    app.get('/seller/:email', async(req,res)=>{
        const email = req.params.email
        const query ={email}
        const user = await userInfoCollection.findOne(query);
        res.send({isSeller: user?.role === 'Seller'});
    })
    app.get('/allsellers', async(req,res)=>{
        const query ={role: "Seller"}
        const user = await userInfoCollection.find(query).toArray();
        res.send(user);
    })
    app.get('/allbuyers', async(req,res)=>{
        const query ={role: "Buyer"}
        const user = await userInfoCollection.find(query).toArray();
        res.send(user);
    })

    app.delete('/deleteSeller/:id', async(req,res)=>{
        const id =req.params.id;
        const query ={ _id: ObjectId(id) };
        const result=await userInfoCollection.deleteOne(query);
        res.send(result);
    })
    app.delete('/deleteBuyer/:id', async(req,res)=>{
        const id =req.params.id;
        const query ={ _id: ObjectId(id) };
        const result=await userInfoCollection.deleteOne(query);
        res.send(result);
    })
    app.delete('/deleteadd/:id', async(req,res)=>{
        const id =req.params.id;
        const query ={ _id: ObjectId(id) };
        const result=await productCollection.deleteOne(query);
        res.send(result);
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