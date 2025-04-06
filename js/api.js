const API_URL = 'http://localhost:3000/api';

const api = {
    async addToCart(productId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId })
        });
        return response.json();
    },

    async quickView(productId) {
        const response = await fetch(`${API_URL}/products/${productId}`);
        return response.json();
    },

    async submitReview(productId, rating, comment) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, rating, comment })
        });
        return response.json();
    }
};