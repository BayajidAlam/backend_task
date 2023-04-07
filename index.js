const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// mongouri 
const uri = `mongodb+srv://nodeUser:LJkdpYR0HNRgODT8@myclaster-1.wxhqp81.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// mongoClient 
const client = new MongoClient(uri, { 
useNewUrlParser: true, 
useUnifiedTopology: true, 
serverApi: ServerApiVersion.v1 
});

async function run(){
  try{
    // collection 
    const studentDetailsCollection = client
    .db('nodeDb')
    .collection('students')

    // initial api 
    app.get('/', (req,res)=>{
      res.send('hello')
    })

    // post data to db(create)
    app.post('/student', async(req,res)=>{
      const data = req.body;
      const result = await studentDetailsCollection.insertOne(data);
      res.send(result)
    })

    // get all data from db(read)
    app.get('/students', async(req,res)=>{
      const query = {};
      const cursor = await studentDetailsCollection.find(query).toArray();
      res.send(cursor)
    })

    // update details 
    app.put('/student/:id', async(req,res)=>{
      const id = req.params.id;
      const doc = req.body;
      console.log(doc);
      const filter = { _id: new ObjectId(id)}
      const option = { upsert: true };
      const updatedDoc = {
        $set: doc
      }
      const result = await studentDetailsCollection.updateOne(filter,updatedDoc,option)
      res.send(result);
    })

    // delete a student form db 
    app.delete('/student/delete/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await studentDetailsCollection.deleteOne(query);
      res.send(result);
    })
  }
  catch{

  }
}
run().catch(err=>{})

app.listen(port, ()=>{
  console.log(`app is listening on port ${port}`);
})