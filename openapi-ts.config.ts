import {defineConfig} from '@hey-api/openapi-ts';

const API_URL = process.env.API_URL || 'https://api.dev.v4.simplenight.com';
export default defineConfig({
  input: `${API_URL}/api/docs-json`,
  output: 'simplenight-sdk/api',
  client: 'fetch',
  schemas: {
    type: 'form',
  },
  services: {
    asClass: true,
    operationId: true,
    name: '{{name}}Service',
    response: 'body',
  },
  types: {
    enums: 'typescript',
    dates: false,
  },
});
