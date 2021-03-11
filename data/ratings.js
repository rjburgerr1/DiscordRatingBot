class Ratings {
  constructor(db) {
    this.collection = db.collection("ratings");
  }
  async addRating(rating) {
    // Filter to find document if pre-existing, for update/creation
    const filter = { author: rating.author, track: rating.track };
    const newRating = await this.collection.findOneAndReplace(filter, rating, {
      upsert: true,
    });

    return newRating;
  }
}
module.exports = Ratings;
