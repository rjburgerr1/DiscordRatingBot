const { Reports } = require("../data/mongodb-utility");
const { collectBasic } = require("../standalone-functions/message-collector");
module.exports = {
  name: "report",
  description: "Report a bug or feature",
  async execute(message, args) {
    const reportType = await getReportTypeArgument(message, args);
    const reportInfo = await getReportInfo(message);
    await createReportDocument(
      { author: message.author, info: reportInfo },
      reportType,
      message
    );
  },
};

const getReportInfo = async (message) => {
  const reportInfoFilter = (msg) => {
    if (!msg.author.bot) {
      // Don't accept bot messages
      return true;
    }
  };
  const reportInfoPrompt = "```Type your report.```";
  const reportInfo = await collectBasic(
    message.author,
    message,

    reportInfoPrompt,
    60000,
    reportInfoFilter
  );
  return reportInfo;
};
const getReportTypeArgument = async (message, args) => {
  const reportTypeFilter = (msg) => {
    if (
      (!msg.author.bot && msg.content.toLowerCase() === "b") ||
      msg.content.toLowerCase() === "f"
    ) {
      // Don't accept bot messages
      return true;
    }
  };

  const reportTypePrompt =
    "```Do you want to report a Bug or Feature?  (b/f)```";

  let reportType;

  if (args[0] === undefined) {
    reportType = await collectBasic(
      message.author,
      message,
      reportTypePrompt,
      20000,
      reportTypeFilter
    );
  } else {
    // Track Name
    reportType = args[0];
  }
  return reportType;
};

async function createReportDocument(reportDoc, reportType, message) {
  try {
    const report = await Reports.addReport(reportDoc, reportType);
    message.author.send("```Added Report!```");
    return report;
  } catch (error) {
    console.error(error);
  }
}
