async function addToCart(payload, options) {
  const body = JSON.stringify(payload);
  const response = await fetch(window.Shopify.routes.root + `cart/add.js?section_id=cart-drawer`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const responseBody = await response.json();
    const error = new Error(`${response.statusText || responseBody.message}`);
    error.name = 'ERROR_ADD_TO_CART';
    throw error;
  }

  const cart = await response.json();
  if (options?.quiet) {
    return cart.items;
  }
  // fire event to update ui
  const customEvent = new CustomEvent('pavari-cart-add', {
    cancelable: false,
    detail: {
      items: cart.items,
      success: true
    }
  });
  dispatchEvent(customEvent);

  return cart.items;
}

document.addEventListener("DOMContentLoaded", () => {
  // buy now
  const buyButtons = document.querySelectorAll('.custom-buy-buttons .button--primary');

  for (const button of buyButtons) {
    button.addEventListener('click', async (e) => {
      const target = e.target;
      target.setAttribute('disabled', 'disabled');

      try {
        await addToCart({
          items: [{
            id: parseInt(target.dataset.variantId),
            quantity: 1,
          }]
        });

        setTimeout(() => {
          window.location.replace('/checkout');
        }, 0);

      } catch (error) {
        console.error('>>> ERR :: ', error);
      }
    });
  }
  // add to cart
  const addToCartButtons = document.querySelectorAll('.custom-buy-buttons .button--secondary');
  console.log('>>> featuredProductsButtons 2', addToCartButtons);
  for (const button of addToCartButtons) {
    button.addEventListener('click', async (e) => {
      const target = e.target;
      target.setAttribute('disabled', 'disabled');

      try {
        await addToCart({
          items: [{
            id: parseInt(target.dataset.variantId),
            quantity: 1,
          }]
        }, { quiet: true });

        //@todo update cart


        target.removeAttribute('disabled');

      } catch (error) {
        console.error('>>> ERR :: addToCartButtons', error);
      }
    });
  }
});

document.addEventListener("pavari-cart-add", () => {
  // redirect to checkout
  window.location.replace('/checkout');
});
