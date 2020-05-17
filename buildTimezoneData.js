const tzdata = require('tzdata');
const fs = require('fs');
const keyBy = require('lodash/keyBy');
const { DateTime, IANAZone } = require('luxon');

const DAY_STEP = 90;

const BOOST_ZONES = new Set([
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
]);

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
  .filter((zoneName) => typeof tzdata.zones[zoneName] !== 'string')
  .map((zoneName) => ({
    name: zoneName,
    nameKeywords: zoneName.replace(/[/_]/g, ' '),
    $boost: BOOST_ZONES.has(zoneName) ? 2.0 : 1.0,
    ...getAllOffsetNames(zoneName),
  }));

fs.writeFile(
  './app/javascript/BuiltInFormControls/timezoneSelectData.json',
  JSON.stringify(
    { zones: keyBy(timezoneOptions, (zone) => zone.name) },
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
