const { Message } = require("discord.js");

class Reports {
  constructor(db) {
    this.bugsCollection = db.collection("bugs");
    this.featuresCollection = db.collection("features");
  }
  async addReport(report, reportType) {
    let collection = "";
    if (reportType.toLowerCase() === "b") {
      collection = this.bugsCollection;
    } else {
      collection = this.featuresCollection;
    }
    // Filter to find document if pre-existing, for update/creation
    const filter = { author: report.author, info: report.info };
    try {
      await collection.findOneAndReplace(filter, report, {
        // Update or insert document
        upsert: true,
      });
    } catch (error) {
      message.author.send("```Failed to report. Try Again.```");
      console.log(error);
    }
  }
}
module.exports = Reports;
