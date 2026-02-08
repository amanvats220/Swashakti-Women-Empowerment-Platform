function loadNavigation() {
  const user = JSON.parse(localStorage.getItem('user'));
  const nav = document.querySelector('nav');
  let navHtml = `<a href="index.html">Home</a>`;
  
  if (!user) {
    navHtml += `<a href="products.html">Products</a>
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>`;
  } else if (user.role === 'seller') {
    //!!! No "Products" here for seller !!!
    navHtml += `<a href="product_upload.html">Add Product</a>
                <a href="seller_products.html">My Products</a>
                <a href="order_history.html">Order History</a>
                <a href="#" id="logoutLink">Logout</a>`;
  } else if (user.role === 'customer') {
    navHtml += `<a href="products.html">Products</a>
                <a href="cart.html">Cart</a>
                <a href="order_history.html">Order History</a>
                <a href="#" id="logoutLink">Logout</a>`;
  }
  nav.innerHTML = navHtml;

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.onclick = function() {
      if(user) {
        localStorage.removeItem(`cart_${user.id}`);
      }
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    };
  }
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
