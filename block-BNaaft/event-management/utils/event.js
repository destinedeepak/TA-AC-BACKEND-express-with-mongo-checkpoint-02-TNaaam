var lodash = require('lodash');

function getUniqCategories(events) {
  const categories = events.reduce((acc, ele) => {
    acc = acc.concat(ele.category);
    return acc;
  }, []);
  return lodash.uniq(categories);
}

function getUniqLocations(events) {
  const locations = events.map((ele) => ele.location);
  return lodash.uniq(locations);
}

module.exports = { getUniqCategories, getUniqLocations};
