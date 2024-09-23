#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import mapValues from 'lodash/mapValues';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
if (!argv.partial) {
  console.error(`Usage: ${process.argv[1]} --partial=PARTIAL_PATH [--complete=COMPLETE_PATH]`);
  process.exit(1);
}

const translation1Path: string = argv.complete ?? './locales/en.json';
const translation2Path: string = argv.partial;

const translation1: any = JSON.parse(fs.readFileSync(translation1Path, { encoding: 'utf-8' }));
const translation2: any = JSON.parse(fs.readFileSync(translation2Path, { encoding: 'utf-8' }));

function diffObjects(o1: any, o2: any): any {
  const diff = mapValues(o1, (value1: string | any, key) => {
    const value2: string | any | null | undefined = o2[key];

    if (typeof value1 === 'string') {
      if (value2 != null && value2 !== '') {
        // the value exists in both translations
        return null;
      }

      // placeholder translation
      return value1;
    }

    const recursiveDiff = diffObjects(value1, (value2 as any) ?? {});
    if (isEmpty(recursiveDiff)) {
      return null;
    }
    return recursiveDiff;
  });

  return pickBy(diff, (value) => value != null);
}

console.log(JSON.stringify(diffObjects(translation1, translation2), undefined, 2));
