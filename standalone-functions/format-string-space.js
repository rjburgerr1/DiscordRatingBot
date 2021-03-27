const formatStringSpace = (string, whitespace) => {
  let result = "";
  for (i = 0; i < whitespace - string.length; i++) {
    result += " ";
  }
  return result;
};

exports.formatStringSpace = formatStringSpace;
