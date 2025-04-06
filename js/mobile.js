document.addEventListener('DOMContentLoaded', () => {
    // Add touch support for product images
    const productImages = document.querySelectorAll('.image-container img');
    productImages.forEach(img => {
        img.addEventListener('touchstart', handleTouchStart);
        img.addEventListener('touchend', handleTouchEnd);
    });

    // Handle mobile menu
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle?.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
});

let touchTimer;

function handleTouchStart() {
    touchTimer = setTimeout(() => {
        this.classList.add('touch-active');
    }, 200);
}

function handleTouchEnd() {
    clearTimeout(touchTimer);
    this.classList.remove('touch-active');
}