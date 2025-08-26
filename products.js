// Products Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products functionality
    initializeProductFilters();
    initializeCart();
    initializeComparison();
    initializeProductInteractions();
    initializeSearch();
});

// Product data for filtering and sorting
const products = Array.from(document.querySelectorAll('.product-card')).map(card => ({
    element: card,
    name: card.dataset.name,
    category: card.dataset.category,
    price: parseInt(card.dataset.price),
    rating: parseFloat(card.dataset.rating)
}));

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('techpro-cart') || '[]');
let comparisonList = [];

function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-products');
    
    // Category filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
    
    // Sorting
    sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
    });
}

function filterProducts(category) {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    
    products.forEach(product => {
        const matchesCategory = category === 'all' || product.category === category;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        
        if (matchesCategory && matchesSearch) {
            product.element.style.display = 'block';
            setTimeout(() => {
                product.element.style.opacity = '1';
                product.element.style.transform = 'translateY(0)';
            }, 50);
        } else {
            product.element.style.opacity = '0';
            product.element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.element.style.display = 'none';
            }, 300);
        }
    });
    
    checkEmptyState();
}

function sortProducts(sortType) {
    const container = document.getElementById('products-grid');
    const sortedProducts = [...products];
    
    switch(sortType) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    // Re-append elements in new order
    sortedProducts.forEach(product => {
        if (product.element.style.display !== 'none') {
            container.appendChild(product.element);
        }
    });
    
    // Add animation
    sortedProducts.forEach((product, index) => {
        if (product.element.style.display !== 'none') {
            setTimeout(() => {
                product.element.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            }, 50);
        }
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('product-search');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
            filterProducts(activeCategory);
        }, 300);
    });
}

function checkEmptyState() {
    const visibleProducts = products.filter(p => p.element.style.display !== 'none');
    const container = document.getElementById('products-grid');
    
    // Remove existing empty state
    const existingEmptyState = container.querySelector('.empty-state');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
    
    if (visibleProducts.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <h3>No se encontraron productos</h3>
            <p>Intenta ajustar tus filtros o búsqueda</p>
            <button class="btn-clear-filters" onclick="clearAllFilters()">Limpiar filtros</button>
        `;
        container.appendChild(emptyState);
    }
}

function clearAllFilters() {
    document.getElementById('product-search').value = '';
    document.querySelector('.filter-btn[data-category="all"]').click();
    document.getElementById('sort-products').value = 'name';
}

// Cart functionality
function initializeCart() {
    updateCartCount();
    
    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                id: card.dataset.name.replace(/\s+/g, '-').toLowerCase(),
                name: card.dataset.name,
                price: parseInt(card.dataset.price),
                image: card.querySelector('.product-image').className,
                quantity: 1
            };
            
            addToCart(product);
            showAddToCartAnimation(this);
        });
    });
    
    // Cart sidebar toggle
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !e.target.classList.contains('btn-add-cart')) {
            cartSidebar.classList.remove('open');
        }
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    saveCart();
    updateCartDisplay();
    showCartSidebar();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('techpro-cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Update cart count in navigation if exists
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #86868b; padding: 40px 0;">Tu carrito está vacío</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image ${item.image}"></div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">&times;</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toLocaleString();
    updateCartCount();
}

function showCartSidebar() {
    document.getElementById('cart-sidebar').classList.add('open');
}

function showAddToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = '¡Agregado!';
    button.style.background = '#34c759';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#0071e3';
    }, 1500);
}

// Product comparison functionality
function initializeComparison() {
    document.querySelectorAll('.btn-compare').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            const card = this.closest('.product-card');
            
            if (comparisonList.includes(productId)) {
                removeFromComparison(productId);
                this.textContent = 'Comparar';
                this.style.background = 'transparent';
            } else if (comparisonList.length < 3) {
                addToComparison(productId, card);
                this.textContent = 'En comparación';
                this.style.background = '#ff9500';
                this.style.color = 'white';
                this.style.borderColor = '#ff9500';
            } else {
                alert('Máximo 3 productos para comparar');
            }
            
            updateComparisonDisplay();
        });
    });
    
    // Close comparison modal
    document.querySelector('.close').addEventListener('click', closeComparisonModal);
    document.getElementById('comparison-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeComparisonModal();
        }
    });
}

function addToComparison(productId, card) {
    const product = {
        id: productId,
        name: card.dataset.name,
        price: parseInt(card.dataset.price),
        rating: parseFloat(card.dataset.rating),
        category: card.dataset.category,
        description: card.querySelector('.product-description').textContent,
        specs: Array.from(card.querySelectorAll('.product-specs span')).map(s => s.textContent),
        image: card.querySelector('.product-image').className
    };
    
    comparisonList.push(product);
}

function removeFromComparison(productId) {
    comparisonList = comparisonList.filter(p => p.id !== productId);
    
    // Reset button state
    const btn = document.querySelector(`[data-product="${productId}"]`);
    if (btn) {
        btn.textContent = 'Comparar';
        btn.style.background = 'transparent';
        btn.style.color = '#0071e3';
        btn.style.borderColor = '#0071e3';
    }
}

function updateComparisonDisplay() {
    if (comparisonList.length === 0) return;
    
    // Show floating comparison bar
    let comparisonBar = document.querySelector('.comparison-bar');
    if (!comparisonBar) {
        comparisonBar = document.createElement('div');
        comparisonBar.className = 'comparison-bar';
        comparisonBar.innerHTML = `
            <div class="comparison-content">
                <span class="comparison-count"></span>
                <button class="btn-show-comparison">Ver comparación</button>
                <button class="btn-clear-comparison">&times;</button>
            </div>
        `;
        document.body.appendChild(comparisonBar);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .comparison-bar {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 15px;
                transform: translateY(100px);
                transition: transform 0.3s ease;
            }
            .comparison-bar.show {
                transform: translateY(0);
            }
            .btn-show-comparison {
                background: #0071e3;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
            }
            .btn-clear-comparison {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #86868b;
            }
        `;
        document.head.appendChild(style);
        
        // Add event listeners
        comparisonBar.querySelector('.btn-show-comparison').addEventListener('click', showComparisonModal);
        comparisonBar.querySelector('.btn-clear-comparison').addEventListener('click', clearComparison);
    }
    
    comparisonBar.querySelector('.comparison-count').textContent = `${comparisonList.length} producto${comparisonList.length !== 1 ? 's' : ''} para comparar`;
    comparisonBar.classList.add('show');
}

function clearComparison() {
    comparisonList.forEach(product => {
        const btn = document.querySelector(`[data-product="${product.id}"]`);
        if (btn) {
            btn.textContent = 'Comparar';
            btn.style.background = 'transparent';
            btn.style.color = '#0071e3';
            btn.style.borderColor = '#0071e3';
        }
    });
    
    comparisonList = [];
    const comparisonBar = document.querySelector('.comparison-bar');
    if (comparisonBar) {
        comparisonBar.classList.remove('show');
    }
}

function showComparisonModal() {
    if (comparisonList.length === 0) return;
    
    const modal = document.getElementById('comparison-modal');
    const table = document.getElementById('comparison-table');
    
    let tableHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>Característica</th>
                    ${comparisonList.map(p => `<th>${p.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Precio</strong></td>
                    ${comparisonList.map(p => `<td>$${p.price.toLocaleString()}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Calificación</strong></td>
                    ${comparisonList.map(p => `<td>${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))} (${p.rating})</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Categoría</strong></td>
                    ${comparisonList.map(p => `<td>${p.category}</td>`).join('')}
                </tr>
                <tr>
                    <td><strong>Descripción</strong></td>
                    ${comparisonList.map(p => `<td>${p.description}</td>`).join('')}
                </tr>
            </tbody>
        </table>
    `;
    
    table.innerHTML = tableHTML;
    modal.style.display = 'block';
    
    // Add comparison table styles
    if (!document.querySelector('#comparison-styles')) {
        const style = document.createElement('style');
        style.id = 'comparison-styles';
        style.textContent = `
            .comparison-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .comparison-table th,
            .comparison-table td {
                padding: 15px;
                text-align: left;
                border-bottom: 1px solid #e5e5e7;
            }
            .comparison-table th {
                background: #f8f9fa;
                font-weight: 600;
                color: #1d1d1f;
            }
            .comparison-table td {
                color: #86868b;
            }
            .comparison-table tr:hover {
                background: #f8f9fa;
            }
        `;
        document.head.appendChild(style);
    }
}

function closeComparisonModal() {
    document.getElementById('comparison-modal').style.display = 'none';
}

// Product interactions
function initializeProductInteractions() {
    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            const container = this.closest('.product-colors');
            container.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Product card hover effects
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
    }
    
    .cart-item-controls button {
        background: #f0f0f0;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .cart-item-controls button:hover {
        background: #0071e3;
        color: white;
    }
    
    .remove-item {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #ff3b30;
        padding: 5px;
        border-radius: 4px;
    }
    
    .remove-item:hover {
        background: #ff3b30;
        color: white;
    }
`;
document.head.appendChild(animationStyles);

// Initialize on load
updateCartDisplay();