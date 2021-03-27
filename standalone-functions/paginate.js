const paginate = (response, regex, pageHeader) => {
  let pages = response.match(regex);
  pages = pages.map((elem) => pageHeader + elem);
  return pages;
};

module.exports.paginate = paginate;
