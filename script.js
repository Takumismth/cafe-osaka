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

// ===== Корзина =====
let cart = [];

const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartCheckout = document.getElementById('cart-checkout');

function openCart() {
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) closeCart();
    });
}

function updateCart() {
    if (!cartCount || !cartItems || !cartTotal) return;

    // Общее количество товаров
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalQty;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
        cartTotal.textContent = '0 ₽';
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const priceNum = parseInt(String(item.price).replace(/\D/g, '')) || 0;
        total += priceNum * item.qty;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}${item.qty > 1 ? ` <span class="cart-qty">×${item.qty}</span>` : ''}</p>
            </div>
            <button class="cart-item-remove" data-index="${index}">×</button>
        `;
        cartItems.appendChild(div);
    });

    cartTotal.textContent = total + ' ₽';

    // Удаление
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            if (cart[index].qty > 1) {
                cart[index].qty -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        };
    });
}

function addToCart(name, price, img, btn) {
    // Ищем такой же товар
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }

    updateCart();

    if (btn) {
        btn.textContent = 'Добавлено ✓';
        btn.classList.add('added');
        setTimeout(() => {
            btn.textContent = 'В корзину';
            btn.classList.remove('added');
        }, 1400);
    }
}

// Кнопки "В корзину"
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const card = this.closest('.card');
        if (card) {
            addToCart(card.dataset.name, card.dataset.price, card.dataset.img, this);
            return;
        }

        // Из модалки
        const title = document.getElementById('modal-title');
        const price = document.getElementById('modal-price');
        const img = document.getElementById('modal-img');
        if (title && price && img) {
            addToCart(title.textContent, price.textContent, img.src, this);
        }
    });
});

if (cartCheckout) {
    cartCheckout.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        alert('Спасибо за заказ!');
        cart = [];
        updateCart();
        closeCart();
    });
}

updateCart();
