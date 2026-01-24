import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    'https://api.hardcover.app/v1/graphql': {
      headers: {
        authorization: process.env.HARDCOVER_TOKEN!,
      },
    },
  },
  documents: ['app/**/*.ts'],
  generates: {
    './app/gql/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        onlyOperationTypes: true,
      },
    },
  },
};

export default config;
