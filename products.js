document.addEventListener('DOMContentLoaded', () => {
  initProductFilter();
  initQuickView();
});

// Filter products by category
function initProductFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// Quick view functionality
function initQuickView() {
  const quickViewButtons = document.querySelectorAll('.hover-overlay .btn');
  
  quickViewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const card = button.closest('.product-card');
      const productData = {
        name: card.querySelector('h3').textContent,
        price: card.querySelector('.current-price').textContent,
        description: card.querySelector('.product-description').textContent,
        image: card.querySelector('.product-image img').src,
        rating: card.querySelector('.product-rating').innerHTML
      };
      
      showQuickView(productData);
    });
  });
}

function showQuickView(product) {
  const modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="close-modal">&times;</button>
      <div class="modal-body">
        <div class="modal-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="modal-info">
          <h2>${product.name}</h2>
          <div class="product-rating">${product.rating}</div>
          <div class="modal-price">${product.price}</div>
          <p>${product.description}</p>
          <div class="quantity-selector">
            <button class="quantity-btn minus">-</button>
            <input type="number" value="1" min="1" max="99">
            <button class="quantity-btn plus">+</button>
          </div>
          <button class="btn btn-primary full-width">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => modal.classList.add('active'), 10);
  
  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.style.overflow = '';
    }, 300);
  };
  
  modal.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
  
  // Quantity controls
  const quantityInput = modal.querySelector('input[type="number"]');
  modal.querySelector('.minus').addEventListener('click', () => {
    if (quantityInput.value > 1) quantityInput.value--;
  });
  modal.querySelector('.plus').addEventListener('click', () => {
    if (quantityInput.value < 99) quantityInput.value++;
  });
}