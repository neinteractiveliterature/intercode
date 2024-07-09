import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { concat, flatMap, get, isArray, isPlainObject, keys, map, set } from 'lodash';
import { join } from 'path';

// adapted from https://stackoverflow.com/a/56064139
export function paths(obj: unknown, parentKey?: string): string[] {
  let result: string[];
  if (isArray(obj)) {
    let idx = 0;
    result = flatMap(obj, (obj: unknown) => {
      return paths(obj, (parentKey || '') + '[' + idx++ + ']');
    });
  } else if (isPlainObject(obj)) {
    result = flatMap(keys(obj), (key) => {
      return map(paths((obj as Record<string, unknown>)[key], key), (subkey) => {
        return (parentKey ? parentKey + '.' : '') + subkey;
      });
    });
  } else {
    result = [];
  }
  return concat(result, parentKey || []);
}

const localesPath = join(__dirname, '../locales');

const localeFiles = readdirSync(localesPath);
const defaultLocaleFile = localeFiles.find((filename) => filename === 'en.json');
const nonDefaultLocaleFiles = localeFiles.filter((filename) => filename !== 'en.json');

if (!defaultLocaleFile) {
  throw new Error('default locale file not found');
}

const defaultTranslations = JSON.parse(readFileSync(join(localesPath, defaultLocaleFile), 'utf-8'));

for (const localeFile of nonDefaultLocaleFiles) {
  const translations = JSON.parse(readFileSync(join(localesPath, localeFile), 'utf-8'));
  const keys = paths(translations);
  const dedupedTranslations = {};

  for (const key of keys) {
    const defaultValue = get(defaultTranslations, key);
    const localizedValue = get(translations, key);
    if (typeof localizedValue !== 'string') {
      continue;
    }

    if (localizedValue != null && localizedValue !== '' && localizedValue !== defaultValue) {
      set(dedupedTranslations, key, localizedValue);
    }
  }

  console.log(`Writing ${localeFile}`);
  writeFileSync(join(localesPath, localeFile), JSON.stringify(dedupedTranslations, null, 2));
}
