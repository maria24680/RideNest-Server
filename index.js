const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");

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
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("ridenest");

    const carCollection = db.collection("car");
    const bookingCollection = db.collection("bookings"); // ✅ ADD THIS

    // ========================
    // 🚗 CAR APIs
    // ========================

    // ADD CAR
    app.post("/car", async (req, res) => {
      try {
        const carData = req.body;
        const result = await carCollection.insertOne(carData);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add car" });
      }
    });

    // GET CARS
    app.get("/car", async (req, res) => {
      try {
        const result = await carCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to get cars" });
      }
    });

    // ========================
    // 📦 BOOKING APIs
    // ========================

    // CREATE BOOKING
    app.post("/bookings", async (req, res) => {
      try {
        const booking = req.body;

        booking.bookingDate = new Date();

        const result = await bookingCollection.insertOne(booking);

        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Booking failed" });
      }
    });

    // GET BOOKINGS
    app.get("/bookings", async (req, res) => {
      try {
        const result = await bookingCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to get bookings" });
      }
    });

    // DELETE BOOKING
app.delete("/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = {
      _id: new ObjectId(id),
    };

    const result = await bookingCollection.deleteOne(query);

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete booking" });
  }
});

app.get("/car/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const car = await carCollection.findOne({
      _id: new ObjectId(id),
    });

    res.send(car);
  } catch (error) {
    res.status(500).send({ message: "Car not found" });
  }
});

    await client.db("admin").command({ ping: 1 });

    console.log("Connected to MongoDB 🚀");
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