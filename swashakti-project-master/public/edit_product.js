window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) return;

  // Get product data from backend
  const resp = await fetch(`http://localhost:5000/api/products/${productId}`);
  const prod = await resp.json();

  document.getElementById('productId').value = prod.id;
  document.getElementById('name').value = prod.name;
  document.getElementById('description').value = prod.description;
  document.getElementById('price').value = prod.price;
  document.getElementById('image_url').value = prod.image_url;
};

document.getElementById('editProductForm').onsubmit = async function (e) {
  e.preventDefault();
  const productId = document.getElementById('productId').value;
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const image_url = document.getElementById('image_url').value;

  const resp = await fetch(`http://localhost:5000/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, price, image_url })
  });
  const result = await resp.json();
  document.getElementById('editMsg').innerText = result.message || result.error;
  if (result.message) setTimeout(()=>window.location.href='seller_products.html',2000);
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
