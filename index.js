const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// const uri = `mongodb+srv://:@cluster0.1knemol.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsplul7.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("RHR-EduDB");
    const serviceCollection = database.collection("services");
    const blogCollection = database.collection("blogs");
    const joinedCollection = database.collection("joined");

    // to load all data
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // to load all blogs
    app.get("/blogs", async (req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // post blog
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });
    // post joined data to database
    app.post("/addServices", async (req, res) => {
      const data = req.body;
      const result = await joinedCollection.insertOne(data);
      res.send(result);
    });
    app.get("/myclass", async (req, res) => {
      const cursor = joinedCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("RHR-Edu is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
