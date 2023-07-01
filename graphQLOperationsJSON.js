// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const { concatAST } = require('graphql');
const { sortBy } = require('lodash');

/**
 *
 * @param {import('graphql').GraphQLSchema} _schema
 * @param {{location: string, document: import('graphql').DocumentNode}[]} documents
 * @param {{}} _config
 * @returns
 */
const GraphQLJSONOperationsPlugin = (_schema, documents, _config) => {
  const sortedDocuments = sortBy(documents, (d) => d.location);
  const allAST = concatAST(sortedDocuments.map((d) => d.document));
  const result = allAST.definitions.reduce((acc, definition) => {
    if (definition.kind === 'OperationDefinition' || definition.kind === 'FragmentDefinition') {
      const name = definition.name?.value;
      if (name) {
        acc[name] = definition;
      }
    }
    return acc;
  }, {});
  return JSON.stringify(result);
};

module.exports = {
  plugin: GraphQLJSONOperationsPlugin,
};
