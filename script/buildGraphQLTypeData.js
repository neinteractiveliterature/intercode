/* eslint-disable no-underscore-dangle, no-console */

const fs = require('fs');

function getFilteredTypesData(schema, filter) {
  return {
    ...schema.data,
    __schema: {
      ...schema.data.__schema,
      types: schema.data.__schema.types.filter(filter),
    },
  };
}

// here we're filtering out any type information unrelated to unions or interfaces
function getFragmentTypesData(schema) {
  return getFilteredTypesData(schema, (type) => type.possibleTypes !== null);
}

function getEnumTypesData(schema) {
  const filteredTypes = getFilteredTypesData(
    schema,
    (type) => type.kind === 'ENUM' && !type.name.startsWith('__'),
  ).__schema.types;

  return filteredTypes.reduce((acc, type) => ({ ...acc, [type.name]: type }), {});
}

function getPossibleTypesData(schema) {
  const possibleTypes = {};

  schema.data.__schema.types.forEach(supertype => {
    if (supertype.possibleTypes) {
      possibleTypes[supertype.name] = supertype.possibleTypes.map(subtype => subtype.name);
    }
  });

  return possibleTypes;
}

function writeDataToFile(data, path) {
  fs.writeFile(
    path, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(`Error writing ${path}`, err);
      } else {
        console.log(`${path} successfully extracted!`);
      }
    },
  );
}

const schema = JSON.parse(fs.readFileSync('./schema.json'));
// no longer needed in @apollo/client 3
// writeDataToFile(getFragmentTypesData(schema), './app/javascript/fragmentTypes.json');
writeDataToFile(getPossibleTypesData(schema), './app/javascript/possibleTypes.json');
writeDataToFile(getEnumTypesData(schema), './app/javascript/enumTypes.json');
