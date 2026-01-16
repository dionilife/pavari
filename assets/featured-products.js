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


async function onBuyNow(event) {
  event.preventDefault();
  event.stopPropagation();

  const quantityInput = document.querySelector('.quantity__input');
  const target = event.target;
  target.setAttribute('disabled', 'disabled');

  try {
    await addToCart({
      items: [{
        id: parseInt(target.dataset.variantId),
        quantity: quantityInput ? parseInt(quantityInput.value) : 1,
      }]
    });

    setTimeout(() => {
      console.log('REDIRECT')
      window.location.replace('/checkout');
    }, 0);

  } catch (error) {
    console.error('>>> ERR :: ', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // buy now
  const buyButtons = document.querySelectorAll('.custom-buy-buttons button.buy-now');
  for (const button of buyButtons) {
    button.addEventListener('click', onBuyNow);
  }

});

// document.addEventListener("pavari-cart-add", () => {
//   // redirect to checkout
//   window.location.replace('/checkout');
// });
