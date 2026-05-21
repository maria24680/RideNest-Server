const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

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

const JWKS = createRemoteJWKSet(
      new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
    )

const verify=async (req,res,next)=>{
  const header= req?.headers.authorization;
  if(!header){
    return res.status(401).json({message: "Unauthorized"})
  }
  const token=header.split(" ")[1]

  

  if (!token) {
    console.log("Invalid scheme or empty token");
    return res.status(401).json({ message: "Unauthorized" });
  }


  try{
  const { payload } = await jwtVerify(token, JWKS)
  next();
  }
  catch(error){
    console.error("JWT Verification failed Error Details:", error.message);
    return res.status(403).json({message: "Forbidden"})
  }
}

async function run() {
  try {
    // await client.connect();

    const db = client.db("ridenest");

    const carCollection = db.collection("car");
    const bookingCollection = db.collection("bookings"); 


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
    // GET CARS
app.get("/car", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const search = req.query.search;
    const type = req.query.type;
    const email = req.query.email;

    let query = {};

    // USER FILTER
    if (email) {
      query.userEmail = email;
    }

    // SEARCH
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // FILTER
    if (type) {
      const typesArray = type.split(",");

      query.type = {
        $in: typesArray,
      };
    }

    let resultQuery = carCollection.find(query);

    if (limit) {
      resultQuery = resultQuery.limit(limit);
    }

    const result = await resultQuery.toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to get cars",
    });
  }
});

  

    // CREATE BOOKING
    app.post("/bookings", verify,async (req, res) => {
  try {
    const booking = req.body;

    booking.bookingDate = new Date();

    const result = await bookingCollection.insertOne(booking);

    if (result.insertedId) {
      await carCollection.updateOne(
        { _id: new ObjectId(booking.carId) },
        {
          $inc: { booking_count: 1 },
        }
      );
    }

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Booking failed" });
  }
});

    // GET BOOKINGS
    app.get("/bookings", verify,async (req, res) => {
  try {
    const email = req.query.email;

    let query = {};

    if (email) {
      query.userEmail = email;
    }

    const result = await bookingCollection
      .find(query)
      .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to get bookings",
    });
  }
});

    // DELETE BOOKING
app.delete("/bookings/:id", verify,async (req, res) => {
  try {
    const id = req.params.id;

    const booking = await bookingCollection.findOne({
      _id: new ObjectId(id),
    });

    const result = await bookingCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount > 0 && booking?.carId) {
      await carCollection.updateOne(
        { _id: new ObjectId(booking.carId) },
        {
          $inc: { booking_count: -1 },
        }
      );
    }

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete booking" });
  }
});

app.get("/car/:id", verify,async (req, res) => {
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

// DELETE CAR
app.delete("/car/:id", verify,async (req, res) => {
  try {
    const id = req.params.id;

    const query = {
      _id: new ObjectId(id),
    };

    const result = await carCollection.deleteOne(query);

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to delete car",
    });
  }
});

// UPDATE CAR
app.patch("/car/:id", verify,async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = req.body;

    const filter = {
      _id: new ObjectId(id),
    };

    const updatedDoc = {
      $set: {
        pricePerDay: updatedData.pricePerDay,
        description: updatedData.description,
        availability: updatedData.availability,
         image: updatedData.image,
         type: updatedData.type,
        location: updatedData.location,
      },
    };

    const result = await carCollection.updateOne(
      filter,
      updatedDoc
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Failed to update car",
    });
  }
});

    // await client.db("admin").command({ ping: 1 });

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

