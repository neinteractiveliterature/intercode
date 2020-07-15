/* eslint-disable no-console */
import fs from 'fs';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
if (!argv.from || !argv.to) {
  console.error(`Usage: ${process.argv[1]} --from=FROM_PATH --to=TO_PATH`);
  process.exit(1);
}

const from: object = JSON.parse(fs.readFileSync(argv.from, { encoding: 'utf-8' }));
const to: object = JSON.parse(fs.readFileSync(argv.to, { encoding: 'utf-8' }));

function mergeObjects(source: object, destination: object) {
  return Object.entries(source).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'string') {
        return { ...acc, [key]: value };
      }

      return {
        ...acc,
        [key]: mergeObjects(value, destination[key] ?? {}),
      };
    },
    destination,
  );
}

console.log(JSON.stringify(mergeObjects(from, to), undefined, 2));
