// @ts-expect-error
import { inflections } from 'inflected';
import InflectionsConfig from '../../config/inflections.json';

type Inflector = {
  acronym: (word: string) => void;
};

inflections('en', (inflector: Inflector) => {
  InflectionsConfig.acronym.forEach((word) => {
    inflector.acronym(word);
  });
});
