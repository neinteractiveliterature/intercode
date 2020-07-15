import fs from 'fs';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';

// TODO make this configurable
const translation1Path = './locales/en.json';
const translation2Path = './locales/es.json';

const translation1: object = JSON.parse(fs.readFileSync(translation1Path, { encoding: 'utf-8' }));
const translation2: object = JSON.parse(fs.readFileSync(translation2Path, { encoding: 'utf-8' }));

function diffObjects(o1: object, o2: object) {
  const diff = mapValues(o1, (value1: string | object, key) => {
    const value2: string | object | null | undefined = o2[key];

    if (typeof value1 === 'string') {
      if (value2 != null && value2 !== '') {
        // the value exists in both translations
        return null;
      }

      // placeholder translation
      return value1;
    }

    const recursiveDiff = diffObjects(value1, (value2 as object) ?? {});
    if (isEmpty(recursiveDiff)) {
      return null;
    }
    return recursiveDiff;
  });

  return pickBy(diff, (value) => value != null);
}

console.log(JSON.stringify(diffObjects(translation1, translation2), undefined, 2));
