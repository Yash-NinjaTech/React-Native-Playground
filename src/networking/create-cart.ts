import apiCore from '@/api/apiCore';
import {xApiKey} from '@src/config';

export async function createCart() {
  const cartResponse = await apiCore.carts.cartsCreate({
    requestBody: {
      currency: 'USD',
    },
    xApiKey,
  });

  console.log('cart create Response:', cartResponse);

  const cartId = cartResponse.id;
  console.log('cartId', cartId);
  const cartUpdateResponse = await apiCore.carts.cartsUpdate({
    cartId,
    requestBody: {
      currency: 'USD',
      customer: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'yash@gsdvs.com',
        phone_number: '1231231234',
        phone_prefix: '1',
        country: 'us',
      },
    },
    xApiKey,
  });

  console.log('Cart Update Response:', cartUpdateResponse);

  return cartId;
}

export async function addHotelToCart(
  cartId: string,
  hotelId: string,
  roomId: string,
) {
  const cartAddResponse = await apiCore.carts.cartItemsCreate({
    cartId,
    requestBody: {
      product_id: hotelId,
      currency: 'USD',
      qty: 1,
      booking_data: {
        category: 'hotels',
        room_id: roomId,
        booking_key: hotelId,
      },
    },
    xApiKey,
  });

  console.log('Cart Add Response:', cartAddResponse);

  return cartId;
}

export async function cartCheckout(
  cartId: '7ca0365b-e488-46f1-b1c7-86976feeb804',
) {
  console.log('cartId', cartId);
  const cartBookResponse = await apiCore.bookings.bookingsCreate({
    requestBody: {
      currency: 'USD',
      payment: {
        card_name: 'John Doe',
        card_number: '4111111111111111',
        card_expiration: '2612', // YYMM
        card_sec: '123',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        country: 'US',
        zipcode: '10001',
        state: 'NY',
      },
      cart_id: cartId,
      captcha_token: 'empty',
    },
    xApiKey,
  });

  console.log('Cart Book Response:', cartBookResponse);
}
