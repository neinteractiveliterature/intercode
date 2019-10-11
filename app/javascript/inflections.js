import { inflections } from 'inflected';
import InflectionsConfig from '../../config/inflections.json';

inflections('en', (inflector) => {
  InflectionsConfig.acronym.forEach((word) => {
    inflector.acronym(word);
  });
});
