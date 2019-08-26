export default function findLiquidTagName(liquidTag) {
  const tagNameTag = liquidTag.tags.find((tag) => tag.tag_name === 'liquid_tag_name');
  return (tagNameTag || {}).text;
}
