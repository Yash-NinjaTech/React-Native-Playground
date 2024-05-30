import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AuthService } from './services.gen';
import { BookingsService } from './services.gen';
import { CartsService } from './services.gen';
import { ConfigMobileService } from './services.gen';
import { ConfigWebService } from './services.gen';
import { LocationsService } from './services.gen';
import { ProductsService } from './services.gen';
import { UsersService } from './services.gen';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class ApiCore {

	public readonly auth: AuthService;
	public readonly bookings: BookingsService;
	public readonly carts: CartsService;
	public readonly configMobile: ConfigMobileService;
	public readonly configWeb: ConfigWebService;
	public readonly locations: LocationsService;
	public readonly products: ProductsService;
	public readonly users: UsersService;

	public readonly request: BaseHttpRequest;

	constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
		this.request = new HttpRequest({
			BASE: config?.BASE ?? '',
			VERSION: config?.VERSION ?? '1.0',
			WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
			CREDENTIALS: config?.CREDENTIALS ?? 'include',
			TOKEN: config?.TOKEN,
			USERNAME: config?.USERNAME,
			PASSWORD: config?.PASSWORD,
			HEADERS: config?.HEADERS,
			ENCODE_PATH: config?.ENCODE_PATH,
			interceptors: {
				request: config?.interceptors?.request ?? new Interceptors(),
				response: config?.interceptors?.response ?? new Interceptors(),
      },
		});

		this.auth = new AuthService(this.request);
		this.bookings = new BookingsService(this.request);
		this.carts = new CartsService(this.request);
		this.configMobile = new ConfigMobileService(this.request);
		this.configWeb = new ConfigWebService(this.request);
		this.locations = new LocationsService(this.request);
		this.products = new ProductsService(this.request);
		this.users = new UsersService(this.request);
	}
}
