document.addEventListener('DOMContentLoaded', () => {
    // Add to Cart buttons
    document.querySelectorAll('.shop-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            try {
                const productId = e.target.closest('.product').dataset.productId;
                button.classList.add('loading');
                const result = await api.addToCart(productId);
                updateCartCount(result.cartCount);
                showNotification('Product added to cart!');
            } catch (error) {
                showNotification('Please login to add items to cart', 'error');
            } finally {
                button.classList.remove('loading');
            }
        });
    });

    // Quick View buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            try {
                const productId = e.target.closest('.product').dataset.productId;
                const product = await api.quickView(productId);
                showQuickViewModal(product);
            } catch (error) {
                showNotification('Failed to load product details', 'error');
            }
        });
    });

    // Review Submit
    document.querySelectorAll('.review-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const productId = form.dataset.productId;
                const rating = form.querySelector('.rating-input').value;
                const comment = form.querySelector('.review-comment').value;
                
                await api.submitReview(productId, rating, comment);
                showNotification('Review submitted successfully!');
                form.reset();
            } catch (error) {
                showNotification('Please login to submit a review', 'error');
            }
        });
    });
});

// Utility functions
function updateCartCount(count) {
    document.querySelector('.cart-count').textContent = count;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showQuickViewModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">Rs. ${product.price}</p>
            <p>${product.description}</p>
            <button class="shop-btn" data-product-id="${product.id}">Add to Cart</button>
        </div>
    `;
    document.body.appendChild(modal);
}