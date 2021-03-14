const url =
  "mongodb+srv://RJ:KkZPj4rSjEwXAPhz@rating-tracks-cluster.ylwln.mongodb.net/test";

const { MongoClient } = require("mongodb");
const config = require("./config.js");
const Ratings = require("./ratings-database-class.js");
const Reports = require("./reports-database-class.js");

class MongoBot {
  constructor() {
    const url = config.host;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
  }
  async init() {
    await this.client.connect();
    console.log("connected");

    this.tracksDB = this.client.db(config.tracksDB);
    this.reportsDB = this.client.db(config.reportsDB);
    this.Ratings = new Ratings(this.tracksDB);
    this.Reports = new Reports(this.reportsDB);
  }
}

module.exports = new MongoBot();
