const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const entities = require('entities');

const LiquidDocs = JSON.parse(fs.readFileSync('../liquid_doc.json'));
const allItems = new Map();

function formatExampleTag(example) {
  return `\`\`\`liquid title="${example.name}"
${example.text}
\`\`\``;
}

function formatParamTag(tag) {
  return `#### \`${tag.name}\` ${tag?.types ? `(${tag.types.map(formatTypeName).join(', ')})` : ''}

${tag?.text ?? ''}`;
}

function formatSeeTag(tag) {
  return `* ${tag.text}: ${tag.name}`;
}

function formatParamTags(tags) {
  const sortedParams = _.sortBy(tags, (tag) => tag.name);
  return sortedParams.map((tag) => formatParamTag(tag)).join('\n\n');
}

function linkifyTypeName(typeName) {
  const item = allItems.get(typeName);
  if (item) {
    return `<a href="/docs/liquid/${item.itemType()}s/${item.filename()}">${entities.encodeHTML(typeName)}</a>`;
  } else {
    return entities.encodeHTML(typeName);
  }
}

function formatTypeName(typeName) {
  if (allItems.has(typeName)) {
    return `<code>${linkifyTypeName(typeName)}</code>`;
  }

  return `<code>${typeName.replace(/\<(\w+)\>/g, (match, p1) => `&lt;${linkifyTypeName(p1)}&gt;`)}</code>`;
}

function formatMethodDoc(method) {
  const returnTag = method.tags.find((tag) => tag.tag_name === 'return');
  const seeTags = method.tags.filter((tag) => tag.tag_name === 'see');
  const exampleTags = method.tags.filter((tag) => tag.tag_name === 'example');

  return `#### \`${method.name}\` ${returnTag?.types ? `(${returnTag.types.map(formatTypeName).join(', ')})` : ''}

${returnTag?.text ?? ''}

${exampleTags.map(formatExampleTag).join('\n\n')}

${seeTags.length > 0 ? `### See also\n${seeTags.map(formatSeeTag).join('\n')}` : ''}`;
}

function formatMethodDocs(klass) {
  const visibleMethods = klass.methods.filter((method) => !method.tags.some((tag) => tag.tag_name === 'api'));
  const sortedMethods = _.sortBy(visibleMethods, (method) => method.name);

  return sortedMethods.map((method) => formatMethodDoc(method)).join('\n\n');
}

function formatFrontmatter(id, title) {
  return `---
id: ${id}
title: ${title}
---
`;
}

function formatClass(id, name, klass) {
  const examples = klass.tags.filter((tag) => tag.tag_name === 'example');

  return `${formatFrontmatter(id, name)}

${klass.docstring}

${examples.length > 0 ? '### Examples' : ''}
${examples.map(formatExampleTag).join('\n\n')}`;
}

function formatDrop(id, name, klass) {
  return `${formatClass(id, name, klass)}

### Fields

${formatMethodDocs(klass)}`;
}

function formatFilterMethod(id, name, filterMethod) {
  const params = filterMethod.tags.filter((tag) => tag.tag_name === 'param');
  const returnTag = filterMethod.tags.find((tag) => tag.tag_name === 'return');
  const examples = filterMethod.tags.filter((tag) => tag.tag_name === 'example');
  const seeTags = filterMethod.tags.filter((tag) => tag.tag_name === 'see');

  return `${formatFrontmatter(id, name)}

${filterMethod.docstring}

${params.length > 0 ? '### Parameters' : ''}
${formatParamTags(params)}

${
  returnTag
    ? `### Returns ${returnTag?.types ? `(${returnTag.types.map(formatTypeName).join(', ')})` : ''}\n${returnTag.text}`
    : ''
}

${examples.length > 0 ? '### Examples' : ''}
${examples.map(formatExampleTag).join('\n\n')}

${seeTags.length > 0 ? `### See also\n${seeTags.map(formatSeeTag).join('\n')}` : ''}`;
}

class DocItem {
  constructor(item, isFilter) {
    this.item = item;
    this.isFilter = isFilter;
  }

  itemType() {
    if (this.isFilter) {
      return 'filter';
    } else if (this.item.superclasses.includes('Liquid::Drop')) {
      return 'drop';
    } else if (this.item.superclasses.includes('Liquid::Tag')) {
      return 'tag';
    } else if (this.item.superclasses.includes('Liquid::Block')) {
      return 'block';
    }
  }

  identifier() {
    if (this.itemType() === 'drop' || this.itemType() === 'filter') {
      return this.item.name;
    } else if (this.itemType() === 'tag' || this.itemType() === 'block') {
      return this.item.tags.find((tag) => tag.tag_name === 'liquid_tag_name')?.text;
    }
  }

  filename() {
    return _.kebabCase(this.identifier());
  }

  outputPath() {
    if (this.itemType() === 'drop') {
      return `./docs/liquid/drops/${this.filename()}.mdx`;
    } else if (this.itemType() === 'block') {
      return `./docs/liquid/blocks/${this.filename()}.mdx`;
    } else if (this.itemType() === 'tag') {
      return `./docs/liquid/tags/${this.filename()}.mdx`;
    } else if (this.itemType() === 'filter') {
      return `./docs/liquid/filters/${this.filename()}.mdx`;
    }
  }

  format() {
    if (this.itemType() === 'drop') {
      return formatDrop(this.filename(), this.identifier(), this.item);
    } else if (this.itemType() === 'block' || this.itemType() === 'tag') {
      return formatClass(this.filename(), this.identifier(), this.item);
    } else {
      return formatFilterMethod(this.filename(), this.identifier(), this.item);
    }
  }

  write() {
    const outputPath = this.outputPath();
    if (outputPath == null) {
      console.warn(`WARNING: couldn't determine output path for ${this.item.name}`);
      return;
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, this.format());
  }
}

console.log('Scanning JSON...');

LiquidDocs.classes.forEach((klass) => {
  const item = new DocItem(klass, false);
  allItems.set(item.identifier(), item);
});

LiquidDocs.filter_methods.forEach((filter) => {
  const item = new DocItem(filter, true);
  allItems.set(item.identifier(), item);
});

console.log('Writing category metadata...');
[
  ['drops', 'Drops'],
  ['tags', 'Tags'],
  ['blocks', 'Blocks'],
  ['filters', 'Filters'],
].forEach(([subdir, categoryName]) => {
  fs.mkdirSync(`./docs/liquid/${subdir}`, { recursive: true });
  fs.writeFileSync(`./docs/liquid/${subdir}/_category_.yml`, `label: ${categoryName}\n`);
});

console.log('Writing sidebar schema...');
fs.writeFileSync(
  './docs/liquid/sidebar-schema.js',
  `module.exports = {
  schemaSidebar: [
    {
      type: 'autogenerated',
      dirName: 'liquid',
    },
  ],
};`,
);

console.log('Writing docs...');
allItems.forEach((item) => {
  item.write();
});
