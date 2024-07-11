import { CodegenConfig } from '@graphql-codegen/cli';

const scalars = {
  BigDecimal: 'string',
  Date: 'string',
  Json: 'string',
  JSON: 'unknown',
  Upload: 'File',
};

const baseConfig = {
  nonOptionalTypename: true,
  strictScalars: true,
  scalars,
};

const addEslintDisable = {
  add: {
    content: '/* eslint-disable */',
  },
};

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.graphql',
  documents: ['./app/javascript/**/*.graphql'],
  generates: {
    'app/javascript/graphqlTypes.generated.ts': {
      plugins: [addEslintDisable, 'typescript'],
      config: baseConfig,
    },
    'app/javascript/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'graphqlTypes.generated.ts',
      },
      plugins: [addEslintDisable, 'typescript-operations', 'typescript-react-apollo'],
      config: {
        ...baseConfig,
        dedupeOperationSuffix: true,
        operationResultSuffix: 'Data',
        withComponent: false,
        withHOC: false,
        withHooks: true,
        documentMode: 'graphQLTag',
        gqlImport: '@apollo/client#gql',
      },
    },
    'app/graphql/graphql_operations_generated.json': {
      plugins: ['./graphQLOperationsJSON.js'],
    },
  },
};

export default config;
