let cart = {};

function addToCart(id, name, price) {
  cart[id] = cart[id] || { name, price, quantity: 0 };
  cart[id].quantity++;
  updateCart();
}

function removeItem(id) {
  if (cart[id]) {
    cart[id].quantity--; // Decrement quantity by 1
    if (cart[id].quantity <= 0) {
      delete cart[id]; // Remove item only if quantity is 0 or negative
    }
    updateCart();
  }
}

function updateCart() {
  let itemsHtml = '';
  let total = 0;
  let itemCount = 0;
  for (let id in cart) {
    let item = cart[id];
    itemsHtml += `${item.name} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)} <button onclick="removeItem('${id}')">Remove</button><br>`;
    total += item.price * item.quantity;
    itemCount += item.quantity;
  }
  document.getElementById('cart-items').innerHTML = itemsHtml || 'Cart is empty';
  document.getElementById('total').textContent = total.toFixed(2);
  document.getElementById('cart-toggle').textContent = `Cart (${itemCount} items)`; // Update cart toggle text
}

function placeOrder() {
  if (!cart || Object.keys(cart).length === 0) {
    alert('Cart is empty. Please add items.');
    return;
  }
  let items = Object.entries(cart).map(([id, { name, quantity, price }]) => ({
    id, name, quantity, total: (price * quantity).toFixed(2)
  }));
  let total = Object.values(cart).reduce((sum, { price, quantity }) => sum + price * quantity, 0).toFixed(2);
  let session_id = new URLSearchParams(window.location.search).get('session_id') || 'default_session';

  fetch('https://n8n.srv815441.hstgr.cloud/webhook/6ed52655-dfd5-48a6-a1a7-6392f159653d/' + session_id, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, items, total })
  })
  .then(response => {
    console.log('Response status:', response.status); // Debug status
    if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);
    return response.json();
  })
  .then(data => {
    console.log('Response from n8n:', data);
    alert('Order sent successfully to n8n!');
  })
  .catch(error => {
    console.error('Error:', error.message); // More detailed error
    alert('Failed to place order. Please try again or contact support. Error: ' + error.message);
  });
}