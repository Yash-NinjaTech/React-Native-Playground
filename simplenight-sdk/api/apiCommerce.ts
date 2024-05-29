import { ApiCommerce as ApiCommerceDefault, OpenAPIConfig } from "./commerce";

// @Deprecated. ApiCommerce will be removed later and replaced with ApiCore. Focus on ApiCore search/details first.
export class ApiCommerce extends ApiCommerceDefault {
  constructor(config?: Partial<OpenAPIConfig>) {
    if (!config) {
      config = {};
    }
    if (!config.BASE) {
      //   config.BASE = process.env.NEXT_PUBLIC_API + '/commerce/v1'
      config.BASE = "https://api.dev.v4.simplenight.com/api" + "/commerce/v1";
    }

    super(config);
  }
}

const apiCommerce = new ApiCommerce();
//apiCommerce.request.config.HEADERS = {'x-api-key': process.env.NEXT_PUBLIC_API_KEY ?? ''} // temporary - load form configuration endpoint (based on hostname)
//apiCommerce.request.config.TOKEN = 'XXX' // if user logged in

export default apiCommerce;
