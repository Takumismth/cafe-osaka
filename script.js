console.log('script loaded');

// Табы
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const id = tab.dataset.tab;
        const content = document.getElementById(id);
        if (content) content.classList.add('active');
    });
});

// Бургер
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
    });
}

// Лого
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Модалка
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.closest('.add-to-cart')) return;

        const img = document.getElementById('modal-img');
        const title = document.getElementById('modal-title');
        const desc = document.getElementById('modal-desc');
        const price = document.getElementById('modal-price');

        if (img) img.src = card.dataset.img || '';
        if (title) title.textContent = card.dataset.name || '';
        if (desc) desc.textContent = card.dataset.desc || '';
        if (price) price.textContent = card.dataset.price || '';

        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (modal) {
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Корзина (простая)
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

function updateCart() {
    if (cartCount) cartCount.textContent = cart.length;
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
        if (cartTotal) cartTotal.textContent = '0 ₽';
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, i) => {
        total += parseInt(String(item.price).replace(/\D/g, '')) || 0;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${i})">×</button>
            </div>
        `;
    });

    if (cartTotal) cartTotal.textContent = total + ' ₽';
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCart();
};

if (cartBtn) cartBtn.addEventListener('click', () => {
    if (cartOverlay) cartOverlay.classList.add('active');
});

if (cartClose) cartClose.addEventListener('click', () => {
    if (cartOverlay) cartOverlay.classList.remove('active');
});

if (cartOverlay) {
    cartOverlay.addEventListener('click', e => {
        if (e.target === cartOverlay) cartOverlay.classList.remove('active');
    });
}

// Добавить в корзину
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const card = this.closest('.card');
        if (card) {
            cart.push({
                name: card.dataset.name,
                price: card.dataset.price,
                img: card.dataset.img
            });
            updateCart();
            this.textContent = 'Добавлено ✓';
            setTimeout(() => this.textContent = 'В корзину', 1200);
            return;
        }

        // из модалки
        const title = document.getElementById('modal-title');
        const price = document.getElementById('modal-price');
        const img = document.getElementById('modal-img');
        if (title && price && img) {
            cart.push({
                name: title.textContent,
                price: price.textContent,
                img: img.src
            });
            updateCart();
            this.textContent = 'Добавлено ✓';
            setTimeout(() => this.textContent = 'В корзину', 1200);
        }
    });
});

updateCart();
