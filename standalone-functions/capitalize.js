const capitalize = (string) => {
  return string
    .toLowerCase()
    .replace(/(^|\s)\S/g, (firstLetter) => firstLetter.toUpperCase());
};

module.exports.capitalize = capitalize;
