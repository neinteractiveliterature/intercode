export default function buildMemberPrefix(name, prefix) {
  let memberPrefix = `${name}.`;
  if (prefix) {
    memberPrefix = `${prefix}${memberPrefix}`;
  }

  return memberPrefix;
}
