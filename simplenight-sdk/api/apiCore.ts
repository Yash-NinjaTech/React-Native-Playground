import {ApiCore as ApiCoreBase, OpenAPIConfig} from './core';

export class ApiCore extends ApiCoreBase {
  constructor(config?: Partial<OpenAPIConfig>) {
    if (!config) {
      config = {};
    }
    if (!config.BASE) {
      const apiUrl =
        process.env.API_URL || 'https://api.dev.v4.simplenight.com';
      config.BASE = apiUrl;
    }

    super(config);
  }
}

const apiCore = new ApiCore();

export default apiCore;
