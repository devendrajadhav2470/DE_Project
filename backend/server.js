const express = require("express");
require("dotenv").config();
const { Pool } = require("pg");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const mongoose = require("mongoose");
// const { connectToMongoDatabase, getMongoDatabase } = require("./mongomodel");
const app = express();

const port = process.env.PORT || 3001;
// PostgreSQL configuration
// connectToMongoDatabase()
//   .then(() => {
//     // Access the MongoDB database and collection
//     const db = getMongoDatabase();
//     const collection = db.collection("vidnation");

//     // Define your Express routes here

//     // Start the Express server
//   })
//   .catch((error) => {
//     console.error("Unable to start the server:", error);
//   });

mongoose.connect("mongodb://127.0.0.1:27017/vidnation", {});
// mongoose.connect(
//   "mongodb+srv://nitish:mdntube@cluster0.luknjg4.mongodb.net/MDNTube",
//   {}
// );
const mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "MongoDB connection error:"));
mongodb.once("open", () => {
  console.log("Connected to MongoDB");
});
const Video = mongoose.model("videos", {}); // No explicit schema
// const Video = mongoose.model("Video Dataset", {});
app.use(cors());
app.use(express.json());
app.get("/feed/videos", async (req, res) => {
  console.log("hi");
  console.log(req.params.codes);
  try {
    const videos = await Video.find().limit(30);
    // const collection = mongoose.connection.db.collection("Video Dataset");
    // const videos = collection.find().limit(30);
    // console.log(videos);
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/mongoUsers/:id", async (req, res) => {
  const user_name = req.params.id;
  const usersMongo = mongoose.connection.db.collection("usersMongo");
  const newUser = {
    user_name: user_name,
    tags: [],
  };
  const filter = { user_name: newUser.user_name };
  // Define the update operation

  // Use findOneAndUpdate to find and update the document
  usersMongo
    .findOne(filter)
    .then((existingUser) => {
      if (existingUser) {
        // If the document with the specified user_name exists, update the tags
        res.json(existingUser);
      } else {
        // If the document doesn't exist, insert a new document
        console.log("user was inserted in mongo");
        return usersMongo.insertOne(newUser);
      }
    })
    .then((result) => {
      // Access the updated or inserted document
    })
    .catch((error) => {
      console.error("Error updating/inserting user:", error);
    });
});
app.get("/videos/:codes", async (req, res) => {
  console.log("hi");
  const videoCodes = req.params.codes.split(",");
  console.log("from b");
  console.log(videoCodes);
  try {
    const videos = await Video.find({ youtubeVideoCode: { $in: videoCodes } });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/videos/search/:id", async (req, res) => {
  try {
    const searchQuery = req.params.id;
    console.log("sq", searchQuery);
    const stopwords = [
      "and",
      "or",
      "the",
      "to",
      "from",
      "with",
      "of",
      "in",
      "for",
      "on",
      "at",
    ];
    console.log(searchQuery);
    const cleanedQuery = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => !stopwords.includes(word))
      .join(" ");
    const keywordswithname = cleanedQuery.split(/\s+/);
    const keywords = keywordswithname.slice(1);
    // Access the MongoDB collection directly
    const collection = mongoose.connection.db.collection("videos");
    console.log(keywords);
    // Construct a MongoDB query to find documents with at least one keyword in title, description, or tags
    ////////
    if (keywordswithname[0] != "!") {
      const usersMongo = mongoose.connection.db.collection("usersMongo");
      const newUser = {
        user_name: keywordswithname[0],
        tags: ["modi", "demonetization", "ban"],
      };
      const filter = { user_name: newUser.user_name };

      // Define the update operation
      const update = {
        $addToSet: { tags: { $each: keywords } }, // Add new tags to the tags array
      };

      // Use findOneAndUpdate to find and update the document
      usersMongo
        .findOne(filter)
        .then((existingUser) => {
          if (existingUser) {
            // If the document with the specified user_name exists, update the tags
            return usersMongo.updateOne(filter, update);
          } else {
            // If the document doesn't exist, insert a new document
            return usersMongo.insertOne(newUser);
          }
        })
        .then((result) => {
          // Access the updated or inserted document
          const updatedUser = result.ops ? result.ops[0] : null;
          console.log("User updated/inserted:", updatedUser);
        })
        .catch((error) => {
          console.error("Error updating/inserting user:", error);
        });
    }
    /////////
    if (keywordswithname[1] != "+") {
      const query = {
        $or: [
          {
            "videoInfo.snippet.title": {
              $regex: keywords.join("|"),
              $options: "i",
            },
          },
          {
            "videoInfo.snippet.localized.description": {
              $regex: keywords.join("|"),
              $options: "i",
            },
          },
          {
            "videoInfo.snippet.tags": {
              $in: keywords.map((keyword) => new RegExp(keyword, "i")),
            },
          },
        ],
      };

      // Projection to calculate relevance score
      const projection = {
        score: {
          $sum: {
            $add: [
              {
                $size: {
                  $setIntersection: ["$videoInfo.snippet.title", keywords],
                },
              },
              {
                $size: {
                  $setIntersection: [
                    "$videoInfo.snippet.localized.description",
                    keywords,
                  ],
                },
              },
              {
                $size: {
                  $setIntersection: ["$videoInfo.snippet.tags", keywords],
                },
              },
            ],
          },
        },
      };

      // Execute the query with projection and sort by relevance score in descending order
      // const result = await Video.find(query, projection)
      //   .sort({ score: -1 })
      //   .toArray();
      // Execute the query with projection and sort by relevance score in descending order
      const result = await collection
        .find(query, projection)
        .sort({ score: -1 })
        .limit(30)
        .toArray();

      // Send the result as JSON response
      res.json(result);
    }
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).send("Internal Server Error");
  }

  ///

  ///
});
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vidnation",
  password: "IntelligenceQ98",
  port: 5432,
});

app.get("/api/sqldata", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  console.log(email);
  try {
    const result = await pool.query("SELECT * FROM users where email=$1", [
      email,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add this line to parse JSON requests

// Example endpoint to insert data into PostgreSQL
app.post("/api/insertsqlData", async (req, res) => {
  //   const { column1, column2, column3 } = req.body; // Assuming you send data in the request body
  const column1 = req.body["user_name"];
  const column2 = req.body["email"];
  const column3 = req.body["user_password"];

  console.log(column1);
  try {
    const result = await pool.query(
      "INSERT INTO users (user_name, email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [column1, column2, column3]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

///////neo4j api///
const neo4jUri = "bolt://127.0.0.1:7687/neo4j";
const neo4jUser = "neo4j";
const neo4jPassword = "abcd1234";

const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
);

app.get("/neo4japi/videos/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const { user_name } = req.query;
  console.log(videoId);
  if (user_name == "undefined") console.log("aahe");
  console.log("hye", user_name);
  const session = driver.session();
  try {
    // Match the source video
    const matchQuery = "MATCH (source:Video {videoCode: $videoId})";

    // Optionally match the user node based on user_name
    let userMatchQuery = "";
    let createEdgeQuery = "";
    if (user_name !== "undefined") {
      userMatchQuery = "MATCH (user:User {user_name: $user_name})";
      createEdgeQuery = "CREATE (user)-[:WATCHED]->(source)";
    }
    console.log(userMatchQuery);
    // Create an edge between user and video if user_name is provided

    // Return related videos
    const returnQuery =
      "MATCH (source)-[:RELATED]->(target:Video) RETURN target LIMIT 5";
    /////
    // const result = await session.run(
    //   "MATCH (source:Video {videoCode: $videoId})-[:RELATED]->(target:Video) RETURN target limit(5)",
    //   { videoId: videoId }
    // );

    // const videos = result.records.map(
    //   (record) => record.get("target").properties
    // );

    // res.json({ videos });
    //////
    const fullQuery = `${matchQuery} ${userMatchQuery} ${createEdgeQuery} WITH source ${returnQuery}`;
    console.log(fullQuery);
    const result = await session.run(fullQuery, { videoId, user_name });

    const videos = result.records.map(
      (record) => record.get("target").properties
    );
    res.json({ videos });
  } catch (error) {
    console.error("Error executing Neo4j query:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await session.close();
  }
});

app.post("/neo4japi/createUser", async (req, res) => {
  const { user_name, email, user_password } = req.body;

  // Use the Neo4j driver to create a user node (replace with your Cypher query)
  const session = driver.session();
  const result = await session.run(
    "CREATE (u:User {user_name: $user_name, email: $email, user_password: $user_password}) RETURN u",
    { user_name, email, user_password }
  );
  session.close();

  res.status(200).json({
    message: "User created successfully",
    data: result.records[0].get("u"),
  });
});
app.get("/neo4japi/history/:userName", async (req, res) => {
  const userName = req.params.userName;

  const session = driver.session();

  try {
    // Match the user node based on user_name and retrieve watched videos
    const query = `
      MATCH (user:User {user_name: $userName})-[:WATCHED]->(video:Video)
      RETURN video
    `;

    const result = await session.run(query, { userName });

    const videos = result.records.map(
      (record) => record.get("video").properties
    );
    console.log("bhai", videos);
    res.json({ videos });
  } catch (error) {
    console.error("Error fetching user history from Neo4j:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await session.close();
  }
});
// Start the Express server

//////
