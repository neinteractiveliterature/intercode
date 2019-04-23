/* eslint-disable no-underscore-dangle, no-console */

const fs = require('fs');

const schema = JSON.parse(fs.readFileSync('./schema.json'));
// here we're filtering out any type information unrelated to unions or interfaces
const filteredData = schema.data.__schema.types.filter(
  type => type.possibleTypes !== null,
);
schema.data.__schema.types = filteredData;
fs.writeFile('./app/javascript/fragmentTypes.json', JSON.stringify(schema.data), (err) => {
  if (err) {
    console.error('Error writing fragmentTypes file', err);
  } else {
    console.log('Fragment types successfully extracted!');
  }
});
