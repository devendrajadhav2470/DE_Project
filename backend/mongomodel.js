// db.js

// const MongoClient = require("mongodb").MongoClient;

// let db;

// async function connectToMongoDatabase() {
//   try {
//     const client = await MongoClient.connect(
//       "mongodb://localhost:27017/vidnation"
//     );
//     db = client.db("vidnation");
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// }

// function getMongoDatabase() {
//   if (!db) {
//     throw new Error("Database not connected");
//   }
//   return db;
// }

// module.exports = {
//   connectToMongoDatabase,
//   getMongoDatabase,
// };
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const ToDoSchema = new Schema({
//   text: { type: String, required: true },
//   complete: { type: Boolean, default: false },
//   timestamp: { type: String, default: Date.now() },
// });
const mongomodel = mongoose.model("videos");
module.exports = mongomodel;
