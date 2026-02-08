window.onload = async function () {
  const productList = document.getElementById('productList');
  productList.innerHTML = '<p>Loading...</p>';

  // Get user and role
  const user = JSON.parse(localStorage.getItem('user'));

  try {
    const resp = await fetch('http://localhost:5000/api/products');
    let products = await resp.json();

    // -- SELLER: apne products hi dikhaye --
    if (user && user.role === 'seller') {
      products = products.filter(p => p.seller_id == user.id);
    }

    // Group by seller name only for customer
    let sellers = {};
    if (!user || user.role === 'customer') {
      products.forEach(p => {
        if (!sellers[p.seller_name]) {
          sellers[p.seller_name] = [];
        }
        sellers[p.seller_name].push(p);
      });
    } else {
      // seller ke liye apne name se group karo (single group)
      const sellerName = user.name;
      sellers[sellerName] = products;
    }

    let html = '';
    for (const sellerName in sellers) {
      html += `<div style="margin-bottom:32px;">
        <h3 style="color:#ff82a9;">Seller: ${sellerName}</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px;">`;

      sellers[sellerName].forEach(product => {
        html += `
          <a href="product_detail.html?id=${product.id}" style="text-decoration:none; color:inherit;">
            <div class="product-card" style="background:#1f1f1f; padding:15px; border-radius:8px; box-shadow:0 0 15px rgba(255,130,169,0.13); cursor:pointer;">
              <img src="${product.image_url}" alt="${product.name}" style="max-width:120px; border-radius:7px; margin-bottom:8px;">
              <div><strong>${product.name}</strong></div>
              <div>${product.description}</div>
              <div><b>₹${product.price}</b></div>
              ${
                (user && user.role === 'customer') 
                ? `<button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>`
                : ''
              }
            </div>
          </a>`;
      });
      html += `</div></div>`;
    }

    productList.innerHTML = html;

  } catch (e) {
    productList.innerHTML = '<p>Error loading products!</p>';
    console.error('Error fetching products:', e);
  }
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
