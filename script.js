// ===== Данные =====
let cart = [];

// ===== Элементы =====
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItemsBox = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartCheckout = document.getElementById('cart-checkout');

// ===== Открытие / закрытие корзины =====
function openCart() {
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) closeCart();
    });
}

// ===== Обновление корзины =====
function updateCart() {
    if (!cartCount || !cartItemsBox || !cartTotal) return;

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItemsBox.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
        cartTotal.textContent = '0 ₽';
        return;
    }

    let total = 0;
    cartItemsBox.innerHTML = '';

    cart.forEach((item, index) => {
        const priceNum = parseInt(String(item.price).replace(/\D/g, '')) || 0;
        total += priceNum;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <button class="cart-item-remove" data-index="${index}">×</button>
        `;
        cartItemsBox.appendChild(div);
    });

    cartTotal.textContent = total + ' ₽';

    // Удаление товара
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => {
            cart.splice(btn.dataset.index, 1);
            updateCart();
        };
    });
}

// ===== Добавление в корзину =====
function addToCart(name, price, img, btn) {
    cart.push({ name, price, img });
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

// Кнопки на карточках
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Если кнопка внутри карточки
        const card = this.closest('.card');
        if (card) {
            addToCart(
                card.dataset.name,
                card.dataset.price,
                card.dataset.img,
                this
            );
            return;
        }

        // Если кнопка в модалке
        const modalTitle = document.getElementById('modal-title');
        const modalPrice = document.getElementById('modal-price');
        const modalImg = document.getElementById('modal-img');

        if (modalTitle && modalPrice && modalImg) {
            addToCart(
                modalTitle.textContent,
                modalPrice.textContent,
                modalImg.src,
                this
            );
        }
    });
});

// ===== Оформить заказ =====
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

// ===== Модалка товара =====
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');

function openModal(card) {
    document.getElementById('modal-img').src = card.dataset.img;
    document.getElementById('modal-title').textContent = card.dataset.name;
    document.getElementById('modal-desc').textContent = card.dataset.desc;
    document.getElementById('modal-price').textContent = card.dataset.price;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) return;
        openModal(card);
    });
});

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// ===== Табы =====
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// ===== Бургер =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
        });
    });
}

// ===== Лого =====
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Escape =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeCart();
    }
});

// Старт
updateCart();
