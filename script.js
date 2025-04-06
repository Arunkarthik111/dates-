document.addEventListener('DOMContentLoaded', () => {
    // Handle active nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Cart functionality
    const cart = {
        items: [],
        total: 0,
        
        addItem(product) {
            this.items.push(product);
            this.updateTotal();
            this.updateUI();
            this.showNotification('Product added to cart!');
        },
        
        updateTotal() {
            this.total = this.items.reduce((sum, item) => sum + item.price, 0);
        },
        
        updateUI() {
            const cartCount = document.querySelector('.cart-count');
            cartCount.textContent = this.items.length;
            cartCount.classList.add('bounce');
            setTimeout(() => cartCount.classList.remove('bounce'), 300);
        },
        
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    };

    document.querySelectorAll('.shop-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('loading')) {
                btn.classList.add('loading');
                setTimeout(() => {
                    cart.addItem({ price: 10 }); // Example product
                    btn.classList.remove('loading');
                }, 500);
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Lazy loading images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Countdown Timer
    function updateCountdown() {
        const countdownElement = document.getElementById('countdown');
        let time = countdownElement.innerHTML;
        let [hours, minutes, seconds] = time.split(':').map(Number);
        
        setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            }
            countdownElement.innerHTML = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    // Newsletter Popup
    setTimeout(() => {
        if (!localStorage.getItem('newsletterShown')) {
            document.getElementById('newsletterPopup').style.display = 'block';
            localStorage.setItem('newsletterShown', 'true');
        }
    }, 5000);

    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product, .testimonial').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        scrollObserver.observe(el);
    });
});