const { Reports } = require("../data/mongoUtil");
const {
  collectReportTypeArg,
} = require("../standalone-functions/collectReportTypeArgument");
const { collectBasic } = require("../standalone-functions/collectBasic");
module.exports = {
  name: "report",
  description: "Report a bug or feature",
  async execute(message, args) {
    const reportType = await getReportTypeArgument(message, args);
    const reportInfo = await getReportInfo(message, "```Type your report.```");
    await createReportDocument(
      { author: message.author, info: reportInfo },
      reportType
    );
  },
};

const getReportInfo = async (message, prompt) => {
  const reportInfo = await collectBasic(message.author, message, prompt, 60000);
  return reportInfo;
};
const getReportTypeArgument = async (message, args) => {
  let reportType;
  if (args[0] === undefined) {
    reportType = await collectReportTypeArg(message.author, message);
  } else {
    // Track Name
    reportType = args[0];
  }
  return reportType;
};

async function createReportDocument(reportDoc, reportType) {
  const report = await Reports.addReport(reportDoc, reportType);
  return report;
}
