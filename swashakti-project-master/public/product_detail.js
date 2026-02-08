window.onload = async function () {
  const productDetail = document.getElementById('productDetail');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    productDetail.innerHTML = '<p>Invalid product!</p>';
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));

  try {
    const resp = await fetch(`http://localhost:5000/api/products/${productId}`);
    if (!resp.ok) throw new Error('Product not found');
    const product = await resp.json();

    let html = `
      <h2>${product.name}</h2>
      <img src="${product.image_url}" alt="${product.name}" style="max-width:200px; border-radius:8px;" />
      <p>${product.description}</p>
      <p><strong>Price:</strong> ₹${product.price}</p>
      <p><strong>Seller:</strong> ${product.seller_name}</p>
    `;

    // Button sirf customer ke liye
    if (user && user.role === 'customer') {
      html += `<button id="addToCartBtn">Add to Cart</button>`;
    }

    productDetail.innerHTML = html;

    // Agar customer hai toh event lagao
    if (user && user.role === 'customer') {
      document.getElementById('addToCartBtn').addEventListener('click', () => {
        addToCart(product);
      });
    }
  } catch (err) {
    productDetail.innerHTML = `<p>${err.message}</p>`;
  }
}

function addToCart(product) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'customer') {
    alert('Only customers can add to cart!');
    return;
  }
  const cartKey = `cart_${user.id}`;
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

  // Product ID check karo
  if (!product.id) {
    alert('Product ID missing! DB error aayega.');
    return;
  }

  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem(cartKey, JSON.stringify(cart));
  alert('Product added to cart!');
}
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

