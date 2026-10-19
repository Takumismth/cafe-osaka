//работал эрлан 
// Бургер
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

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

// Лого → наверх
document.getElementById('logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Табы
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Модалка товара
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');

function openModal(card) {
    modalImg.src = card.dataset.img;
    modalTitle.textContent = card.dataset.name;
    modalDesc.textContent = card.dataset.desc;
    modalPrice.textContent = card.dataset.price;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) return;
        openModal(card);
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeCart();
    }
});

// ===== Корзина =====
let cart = [];

const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

function openCart() {
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCart();
});

function updateCart() {
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
        cartTotal.textContent = '0 ₽';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const priceNum = parseInt(item.price);
        total += priceNum;

        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price}</p>
            </div>
            <button class="cart-item-remove" data-index="${index}">×</button>
        `;
        cartItems.appendChild(el);
    });

    cartTotal.textContent = total + ' ₽';

    // Удаление
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            cart.splice(btn.dataset.index, 1);
            updateCart();
        });
    });
}

// Добавление в корзину
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();

        const card = this.closest('.card') || this.closest('.modal-body')?.closest('.modal')?.querySelector('.modal') ;
        
        // Берём данные
        let name, price, img;

        if (this.closest('.card')) {
            const card = this.closest('.card');
            name = card.dataset.name;
            price = card.dataset.price;
            img = card.dataset.img;
        } else {
            // Из модалки
            name = modalTitle.textContent;
            price = modalPrice.textContent;
            img = modalImg.src;
        }

        cart.push({ name, price, img });
        updateCart();

        this.textContent = 'Добавлено ✓';
        this.classList.add('added');

        setTimeout(() => {
            this.textContent = 'В корзину';
            this.classList.remove('added');
        }, 1500);
    });
});

// Оформить заказ
document.getElementById('cart-checkout').addEventListener('click', () => {
    if (cart.length === 0) return;
    alert('Спасибо за заказ! Мы свяжемся с вами.');
    cart = [];
    updateCart();
    closeCart();
});
