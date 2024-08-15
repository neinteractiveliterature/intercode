import { YardMethod } from './DocData';

export type MethodReturnClass = {
  returnClassName: string | null;
  assignName: string;
};

export default function findMethodReturnClass(method: YardMethod): MethodReturnClass {
  const returnClassTag = method.tags.find((tag) => tag.tag_name === 'return');
  let returnClassName = returnClassTag ? (returnClassTag.types || [])[0] : null;
  let assignName = method.name;

  if (returnClassName) {
    const matchResult = returnClassName.match(/^Array<(\w+)>$/);
    if (matchResult) {
      [, returnClassName] = matchResult;
      assignName = `${method.name}[index]`;
    }
  }

  return { returnClassName, assignName };
}
