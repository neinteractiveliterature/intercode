// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const { concatAST } = require('graphql');
const { print } = require('graphql/language/printer');
const { sortBy, uniq } = require('lodash');

/**
 *
 * @param {import('graphql').SelectionSetNode} selectionSet
 * @param {{ [name: string]: import('graphql').FragmentDefinitionNode }} fragmentsByName
 * @param {Set<string>} seenFragments
 * @returns {string[]}
 */
function getFragmentNames(selectionSet, fragmentsByName, seenFragments) {
  return selectionSet.selections.flatMap((selection) => {
    if (selection.kind === 'FragmentSpread') {
      const fragment = fragmentsByName[selection.name.value];
      if (seenFragments.has(selection.name.value)) {
        return [selection.name.value];
      } else {
        seenFragments.add(selection.name.value);
        return [selection.name.value, ...getFragmentNames(fragment.selectionSet, fragmentsByName, seenFragments)];
      }
    } else if (selection.kind === 'Field') {
      if (selection.selectionSet) {
        return getFragmentNames(selection.selectionSet, fragmentsByName, seenFragments);
      } else {
        return [];
      }
    } else if (selection.kind === 'InlineFragment') {
      return getFragmentNames(selection.selectionSet, fragmentsByName, seenFragments);
    } else {
      return [];
    }
  });
}

/**
 *
 * @param {import('graphql').GraphQLSchema} _schema
 * @param {{location: string, document: import('graphql').DocumentNode}[]} documents
 * @returns
 */
const GraphQLJSONOperationsPlugin = (_schema, documents) => {
  const sortedDocuments = sortBy(documents, (d) => d.location);
  const allAST = concatAST(sortedDocuments.map((d) => d.document));
  /** @type {{ [name: string] : import('graphql').OperationDefinitionNode }} */
  const operationsByName = allAST.definitions.reduce((acc, definition) => {
    if (definition.kind === 'OperationDefinition') {
      const name = definition.name?.value;
      if (name) {
        acc[name] = definition;
      }
    }
    return acc;
  }, {});
  /** @type {{ [name: string] : import('graphql').FragmentDefinitionNode }} */
  const fragmentsByName = allAST.definitions.reduce((acc, definition) => {
    if (definition.kind === 'FragmentDefinition') {
      const name = definition.name?.value;
      if (name) {
        acc[name] = definition;
      }
    }
    return acc;
  }, {});
  const result = Object.entries(operationsByName).reduce((acc, [name, definition]) => {
    const fragmentNames = uniq(getFragmentNames(definition.selectionSet, fragmentsByName, new Set()));
    const parts = [print(definition), ...fragmentNames.map((fragmentName) => print(fragmentsByName[fragmentName]))];
    const document = parts.join('\n');
    acc[name] = {
      document,
      ast: {
        kind: 'Document',
        definitions: [definition, ...fragmentNames.map((fragmentName) => fragmentsByName[fragmentName])],
      },
    };
    return acc;
  }, {});
  return JSON.stringify(result);
};

module.exports = {
  plugin: GraphQLJSONOperationsPlugin,
};
