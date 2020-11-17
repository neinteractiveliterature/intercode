import tzdata from 'tzdata/timezone-data.json';
import fs from 'fs';
import keyBy from 'lodash/keyBy';
import { subDays } from 'date-fns';
import { format } from 'date-fns-tz';

const DAY_STEP = 90;

const BOOST_ZONES = new Set([
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
]);

// stolen from Luxon
function isValidZone(zone: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone }).format();
    return true;
  } catch (e) {
    return false;
  }
}

function getAllOffsetNames(zoneName: string) {
  // hackkkkkkk alert: iterate through all days in the past year and find all offset names
  // during that time
  const shortOffsetNames = new Set();
  const longOffsetNames = new Set();

  let currentTime = new Date();

  for (let i = 0; i < 366; i += DAY_STEP) {
    shortOffsetNames.add(format(currentTime, 'zzz', { timeZone: zoneName }));
    longOffsetNames.add(format(currentTime, 'zzzz', { timeZone: zoneName }));
    currentTime = subDays(currentTime, DAY_STEP);
  }
  return {
    shortOffsetNames: [...shortOffsetNames],
    longOffsetNames: [...longOffsetNames],
  };
}

const getBoostForTimezone = (zoneName: string) => {
  if (BOOST_ZONES.has(zoneName)) {
    return 2.0;
  }

  const slashes = zoneName.match(/\//g) || [];
  if (slashes.length !== 1) {
    return 0.5;
  }

  return 1.0;
};

const timezoneOptions = Object.keys(tzdata.zones)
  .filter(isValidZone)
  .filter((zoneName) => typeof tzdata.zones[zoneName as keyof typeof tzdata.zones] !== 'string')
  .map((zoneName) => ({
    name: zoneName,
    nameKeywords: zoneName.replace(/[/_]/g, ' '),
    $boost: getBoostForTimezone(zoneName),
    ...getAllOffsetNames(zoneName),
  }));

fs.writeFile(
  './app/javascript/BuiltInFormControls/timezoneSelectData.json',
  JSON.stringify({ zones: keyBy(timezoneOptions, (zone) => zone.name) }, null, 2),
  (err) => {
    if (err) {
      console.error('Error writing timezone data', err);
    } else {
      console.log('Timezone data successfully written!');
    }
  },
);
