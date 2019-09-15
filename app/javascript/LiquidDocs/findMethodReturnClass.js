export default function findMethodReturnClass(method) {
  const returnClassTag = method.tags.find((tag) => tag.tag_name === 'return');
  let returnClassName = (returnClassTag ? (returnClassTag.types || [])[0] : null);
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
