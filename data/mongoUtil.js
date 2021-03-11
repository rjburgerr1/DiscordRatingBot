const url =
  "mongodb+srv://RJ:KkZPj4rSjEwXAPhz@rating-tracks-cluster.ylwln.mongodb.net/test";

const { MongoClient } = require("mongodb");
const config = require("./config.js");
const Ratings = require("../data/ratings.js");

class MongoBot {
  constructor() {
    const url = config.host;

    this.client = new MongoClient(url, { useUnifiedTopology: true });
  }
  async init() {
    await this.client.connect();
    console.log("connected");

    this.db = this.client.db(config.db);
    this.Ratings = new Ratings(this.db);
  }
}

module.exports = new MongoBot();
