document.addEventListener('DOMContentLoaded', async function() {
  const user = JSON.parse(localStorage.getItem('user'));
  const sellerDiv = document.getElementById('sellerProducts');
  if (!user || user.role !== 'seller') {
    sellerDiv.innerHTML = "<p>Please login as seller to see your products.</p>";
    return;
  }
  sellerDiv.innerHTML = "<p>Loading your products...</p>";

  try {
    const res = await fetch('http://localhost:5000/api/products');
    const products = await res.json();
    // Filter out seller's products only
    const myProducts = products.filter(p => p.seller_id == user.id);
    if (!myProducts.length) {
      sellerDiv.innerHTML = "<p>No products uploaded yet.</p>";
      return;
    }
    let html = `<div class="my-products-list">`;
    myProducts.forEach(prod => {
      html += `
        <div class="product-card" style="background:#232323; margin:8px; border-radius:8px; padding:16px;">
          <img src="${prod.image_url}" alt="${prod.name}" style="height:80px; border-radius:6px;"/>
          <div><strong>${prod.name}</strong></div>
          <div>₹${prod.price}</div>
          <button class="edit-btn" data-id="${prod.id}">Edit</button>
          <button class="delete-btn" data-id="${prod.id}">Delete</button>
        </div>
      `;
    });
    html += "</div>";
    sellerDiv.innerHTML = html;

    // EDIT button event
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.onclick = function() {
        const prodId = btn.getAttribute('data-id');
        window.location.href = `product_edit.html?id=${prodId}`;
      };
    });

    // DELETE button event
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = async function() {
        const prodId = btn.getAttribute('data-id');
        if (confirm("Delete this product?")) {
          const delRes = await fetch(`http://localhost:5000/api/products/${prodId}`, { method: "DELETE" });
          const delData = await delRes.json();
          alert(delData.message || delData.error);
          location.reload();
        }
      };
    });
  } catch (err) {
    sellerDiv.innerHTML = "<p>Error loading products.</p>";
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
