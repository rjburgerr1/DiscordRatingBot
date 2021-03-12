class Ratings {
  constructor(db) {
    this.collection = db.collection("ratings");
  }
  async addRating(rating) {
    // Filter to find document if pre-existing, for update/creation
    const filter = { author: rating.author, track: rating.track };
    await this.collection.findOneAndReplace(filter, rating, {
      upsert: true,
    });
  }
}
module.exports = Ratings;
