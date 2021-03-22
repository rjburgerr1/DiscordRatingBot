const paginate = (response, regex) => {
  return response.match(regex);
};

module.exports.paginate = paginate;
