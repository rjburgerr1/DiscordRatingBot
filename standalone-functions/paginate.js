const paginate = (response, pageHeader) => {
  // pageLength has a max of 2000, page footer is always ~70 characters
  pageLengthTrunc = 2000 - 70 - pageHeader.length;
  const regex = new RegExp("(.|\n){1," + pageLengthTrunc + "}\n", "g");
  let pages = response.match(regex);
  pages = pages.map((elem) => pageHeader + elem);

  return pages;
};

const sendPageMessage = async (channel, pages, pageNumber) => {
  let message;
  if (pageNumber > pages.length) {
    message = await channel.send(
      "```diff\n- Page number Doesn't exist! Retry a new page number, or another command. -\n```"
    );
  } else {
    message = await channel.send(
      pages[pageNumber - 1] +
        "----------\nPages " +
        pageNumber +
        "/" +
        pages.length +
        "\n```"
    );
  }
  return message;
};

const editPageMessage = async (message, pages, pageNumber) => {
  message = await message.edit(
    pages[pageNumber - 1] +
      "----------\nPages " +
      pageNumber +
      "/" +
      pages.length +
      "\n```"
  );

  return message;
};

exports.paginate = paginate;
exports.sendPageMessage = sendPageMessage;

exports.editPageMessage = editPageMessage;
