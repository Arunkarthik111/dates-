const filterProducts = {
    byPrice(products, minPrice, maxPrice) {
        return products.filter(p => 
            p.price >= minPrice && p.price <= maxPrice
        );
    },
    
    byCategory(products, category) {
        return products.filter(p => p.category === category);
    },
    
    byRating(products, minRating) {
        return products.filter(p => p.rating >= minRating);
    }
};