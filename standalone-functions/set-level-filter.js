// Method to find specific level ratings i.e.  7.3 or whole range level. i.e. 7-7.99
const setDecOrInt = (levelFilter) => {
  if (levelFilter.indexOf(".") == -1) {
    return [levelFilter, Number(levelFilter) + 0.99];
  } else {
    return [levelFilter, levelFilter];
  }
};

module.exports.setDecOrInt = setDecOrInt;
