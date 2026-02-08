const productUploadForm = document.getElementById('productUploadForm');

if (productUploadForm) {
  productUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get logged-in user from localStorage (no manual seller_id input)
    const user = JSON.parse(localStorage.getItem('user'));
    const seller_id = user ? user.id : null;

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const image_url = document.getElementById('image_url').value;

    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, image_url, seller_id }),
      });

      const data = await res.json();
      alert(data.message || data.error);
      if (!data.error) productUploadForm.reset();
    } catch (error) {
      alert('Error uploading product!');
      console.error('Product upload error:', error);
    }
  });
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

