document.addEventListener('DOMContentLoaded', async function() {
  const user = JSON.parse(localStorage.getItem('user'));
  const orderHistoryDiv = document.getElementById('orderHistory');
  if (!user) {
    orderHistoryDiv.innerHTML = "<p>Please login to view orders.</p>";
    return;
  }
  orderHistoryDiv.innerHTML = '<p>Loading orders...</p>';

  try {
    const res = await fetch(`http://localhost:5000/api/orders/${user.id}`);
    const orders = await res.json();
    if (!orders.length) {
      orderHistoryDiv.innerHTML = "<p>No orders found.</p>";
      return;
    }
    let html = '';
    let lastOrderId = null;
    orders.forEach(order => {
      if (order.order_id !== lastOrderId) {
        if (lastOrderId) html += "</div>";
        html += `
          <div class="order-block">
            <h3>Order #${order.order_id}</h3>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <div class="order-items-list">
        `;
        lastOrderId = order.order_id;
      }
      html += `
        <div class="order-item">
          <img src="${order.image_url}" alt="${order.product_name}" style="height: 50px; border-radius: 5px;"/>
          <span>${order.product_name}</span>
          <span>Qty: ${order.quantity}</span>
          <span>Price: ₹${order.price}</span>
        </div>
      `;
    });
    html += "</div></div>";
    orderHistoryDiv.innerHTML = html;
  } catch (err) {
    orderHistoryDiv.innerHTML = "<p>Error loading orders.</p>";
  }
});
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
