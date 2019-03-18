import DocData from '../../../liquid_doc.json';

let classesByName = null;

export default function findClass(className) {
  if (className == null) {
    return null;
  }

  if (classesByName == null) {
    classesByName = DocData.classes.reduce(
      (map, klass) => map.set(klass.name, klass),
      new Map(),
    );
  }

  const arrayMatch = className.match(/^Array<(\w+)>$/);
  if (arrayMatch) {
    return findClass(arrayMatch[1]);
  }

  return classesByName.get(className);
}
