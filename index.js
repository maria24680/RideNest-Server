const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();

    const db = client.db("ridenest");

    const carCollection = db.collection("car");

    app.post("/car", async (req, res) => {
      const carData = req.body;

      console.log(carData);

      const result = await carCollection.insertOne(carData);

      res.send(result);
    });

    app.get("/car", async (req, res) => {
  try {
    const result = await carCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to get cars" });
  }
});

    await client.db("admin").command({ ping: 1 });

    console.log("Connected to MongoDB");

  } catch (error) {
    console.log(error);
  }
}

run();

app.get("/", (req, res) => {
  res.send("RideNest Server Running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});