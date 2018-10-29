import DocData from '../../../liquid_doc.json';

let classesByName = null;

export default function findClass(className) {
  if (classesByName == null) {
    classesByName = DocData.classes.reduce(
      (map, klass) => map.set(klass.name, klass),
      new Map(),
    );
  }

  return classesByName.get(className);
}
