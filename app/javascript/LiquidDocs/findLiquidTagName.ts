import { YardClass } from './DocData';

export default function findLiquidTagName(liquidTag: YardClass): string {
  const tagNameTag = liquidTag.tags.find((tag) => tag.tag_name === 'liquid_tag_name');
  return tagNameTag?.text ?? '';
}
