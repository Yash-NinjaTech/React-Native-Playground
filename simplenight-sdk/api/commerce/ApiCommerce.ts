import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { Interceptors } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';

import { AuthService } from './services.gen';
import { BookingsService } from './services.gen';
import { CartService } from './services.gen';
import { CheckoutService } from './services.gen';
import { ConfigService } from './services.gen';
import { LocationsService } from './services.gen';
import { ProductsService } from './services.gen';
import { UsersService } from './services.gen';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class ApiCommerce {

	public readonly auth: AuthService;
	public readonly bookings: BookingsService;
	public readonly cart: CartService;
	public readonly checkout: CheckoutService;
	public readonly config: ConfigService;
	public readonly locations: LocationsService;
	public readonly products: ProductsService;
	public readonly users: UsersService;

	public readonly request: BaseHttpRequest;

	constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
		this.request = new HttpRequest({
			BASE: config?.BASE ?? 'https://api.dev.v4.simplenight.com/api',
			VERSION: config?.VERSION ?? '1.0.0',
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
		this.cart = new CartService(this.request);
		this.checkout = new CheckoutService(this.request);
		this.config = new ConfigService(this.request);
		this.locations = new LocationsService(this.request);
		this.products = new ProductsService(this.request);
		this.users = new UsersService(this.request);
	}
}
