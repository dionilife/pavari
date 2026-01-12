async function addToCart(payload, options) {
  const body = JSON.stringify(payload);
  const response = await fetch(window.Shopify.routes.root + `cart/add.js`, {
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
  const featuredProductsButtons = document.querySelectorAll('.custom-card-product_image-container-buttons .button--primary');

  for (const button of featuredProductsButtons) {
    button.addEventListener('click', async (e) => {
      const target = e.target;
      target.setAttribute('disabled', 'disabled');

      try {
        await addToCart({
          items: {
            id: target.dataset.variantId,
            quantity: 1,
          }
        });
      } catch (error) {
        console.error('>>> ERR :: ', error);
      }
    });
  }
});
