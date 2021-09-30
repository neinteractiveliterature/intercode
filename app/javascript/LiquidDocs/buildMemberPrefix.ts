export default function buildMemberPrefix(name: string, prefix?: string | null): string {
  let memberPrefix = `${name}.`;
  if (prefix) {
    memberPrefix = `${prefix}${memberPrefix}`;
  }

  return memberPrefix;
}
