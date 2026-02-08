window.onload = function() {
  const user = JSON.parse(localStorage.getItem('user'));
  const cartContainer = document.getElementById('cartContainer');
  
  if (!user) {
    cartContainer.innerHTML = '<p>Please login to view your cart!</p>';
    return;
  }

  const cartKey = `cart_${user.id}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let html = '<h2>Your Cart</h2><div class="cart-items">';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    html += `
      <div class="cart-item">
        <img src="${item.image_url}" alt="${item.name}" style="max-width:100px; border-radius:6px;" />
        <div><strong>${item.name}</strong></div>
        <div>Quantity: ${item.quantity}</div>
        <div>Price: ₹${item.price}</div>
        <hr />
      </div>
    `;
  });
  html += `</div><h3>Total: ₹${total.toFixed(2)}</h3>`;
  cartContainer.innerHTML = html;

  document.getElementById('placeOrderBtn').onclick = function() {
    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        items: cart,
        total: total.toFixed(2),
      }),
    })
    .then(resp => resp.json())
    .then(data => {
      if(data.error) {
        alert('Order failed: ' + data.error);
      } else {
        alert('Order placed successfully! Order ID: ' + data.orderId);
        localStorage.removeItem(cartKey);
        window.location.href = 'index.html';
      }
    })
    .catch(err => {
      alert('Order failed!');
      console.error(err);
    });
  };
};
document.addEventListener('DOMContentLoaded', function() {
  var icon = document.getElementById('floatingHelpIcon');
  var modal = document.getElementById('helpModal');
  var closeBtn = document.getElementById('closeHelpModal');
  if (icon && modal) {
    icon.onclick = function() {
      modal.style.display = 'block';
    };
  }
  if (closeBtn && modal) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
});
