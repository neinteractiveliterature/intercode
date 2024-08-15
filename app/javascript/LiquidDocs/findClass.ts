import { YardClass, YardDocs } from './DocData';

let classesByName: Map<string, YardClass> | null = null;

export default function findClass(docData: YardDocs, className?: string | null): YardClass | undefined {
  if (className == null) {
    return undefined;
  }

  if (classesByName == null) {
    classesByName = docData.classes.reduce((map, klass) => map.set(klass.name, klass), new Map());
  }

  const arrayMatch = className.match(/^Array<(\w+)>$/);
  if (arrayMatch) {
    return findClass(docData, arrayMatch[1]);
  }

  return classesByName.get(className);
}
