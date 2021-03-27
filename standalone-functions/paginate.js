const paginate = (response, regex, pageHeader) => {
  let pages = response.match(regex);
  pages = pages.map((elem) => pageHeader + elem);
  return pages;
};

const sendPageMessage = (message, pages, pageNumber) => {
  if (pageNumber > pages.length) {
    message.author.send(
      "```diff\n- Page number Doesn't exist! Retry a new page number, or another command. -\n```"
    );
  } else {
    message.author.send(
      pages[pageNumber - 1] +
        "----------\nPages " +
        pageNumber +
        "/" +
        pages.length +
        "\n```"
    );
  }
};

exports.paginate = paginate;
exports.sendPageMessage = sendPageMessage;
