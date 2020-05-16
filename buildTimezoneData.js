const tzdata = require('tzdata');
const fs = require('fs');
const lunr = require('lunr');
const keyBy = require('lodash/keyBy');
const { DateTime, IANAZone } = require('luxon');

const DAY_STEP = 90;

function getAllOffsetNames(zoneName) {
  // hackkkkkkk alert: iterate through all days in the past year and find all offset names
  // during that time
  const shortOffsetNames = new Set();
  const longOffsetNames = new Set();

  let currentTime = DateTime.fromObject({ zone: zoneName });
  if (currentTime.isOffsetFixed) {
    return {
      shortOffsetNames: [currentTime.offsetNameShort],
      longOffsetNames: [currentTime.offsetNameLong],
    };
  }

  for (let i = 0; i < 366; i += DAY_STEP) {
    shortOffsetNames.add(currentTime.offsetNameShort);
    longOffsetNames.add(currentTime.offsetNameLong);
    currentTime = currentTime.minus({ days: DAY_STEP });
  }
  return {
    shortOffsetNames: [...shortOffsetNames],
    longOffsetNames: [...longOffsetNames],
  };
}

const timezoneOptions = Object.keys(tzdata.zones)
  .filter((zoneName) => IANAZone.isValidZone(zoneName))
  .map((zoneName) => ({
    name: zoneName,
    ...getAllOffsetNames(zoneName),
  }));

const index = lunr(function buildIndex() {
  this.ref('name');
  this.field('name');
  this.field('shortOffsetNames');
  this.field('longOffsetNames');

  timezoneOptions.forEach(function processDocument(doc) {
    this.add(doc);
  }, this);
});

fs.writeFile(
  './app/javascript/BuiltInFormControls/timezoneSelectData.json',
  JSON.stringify(
    { zones: keyBy(timezoneOptions, (zone) => zone.name), index },
    null,
    2,
  ),
  (err) => {
    if (err) {
      console.error('Error writing timezone data', err);
    } else {
      console.log('Timezone data successfully written!');
    }
  },
);
