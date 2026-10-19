// ===== Звуки =====
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
            osc.frequency.value = 620;
            gain.gain.value = 0.04;
            osc.type = 'sine';
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.stop(ctx.currentTime + 0.12);
        }
        if (type === 'add') {
            osc.frequency.value = 780;
            gain.gain.value = 0.05;
            osc.type = 'triangle';
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
            osc.stop(ctx.currentTime + 0.18);
        }
        if (type === 'success') {
            osc.frequency.value = 520;
            gain.gain.value = 0.06;
            osc.type = 'sine';
            osc.start();
            setTimeout(() => { try { osc.frequency.value = 720; } catch (e) {} }, 100);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.stop(ctx.currentTime + 0.35);
        }
    } catch (e) { /* ignore audio errors */ }
}

// ===== Тема =====
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.add(savedTheme);

const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        playSound('click');
        if (body.classList.contains('light')) {
            body.classList.remove('light');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark');
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===== Утилиты: блокировка скролла + focus trap для оверлеев =====
let overlayOpenCount = 0;
function lockScroll() {
    overlayOpenCount = Math.max(0, overlayOpenCount) + 1;
    if (overlayOpenCount === 1) document.body.style.overflow = 'hidden';
}
function unlockScroll() {
    overlayOpenCount = Math.max(0, overlayOpenCount - 1);
    if (overlayOpenCount === 0) document.body.style.overflow = '';
}

function createFocusTrap(container) {
    const focusableSelector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(container.querySelectorAll(focusableSelector)).filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return () => {};
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    function handler(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
}

// ===== Бургер =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', () => {
        playSound('click');
        const opened = burger.classList.toggle('active');
        nav.classList.toggle('open', opened);
        burger.setAttribute('aria-expanded', String(opened));
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== Лого =====
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('click', e => {
        e.preventDefault();
        playSound('click');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Табы =====
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        playSound('click');
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const content = document.getElementById(tab.dataset.tab);
        if (content) content.classList.add('active');
    });
});

// ===== Модалка товара =====
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
let modalFocusCleanup = null;
let modalLastFocused = null;

function openModal(card) {
    if (!modal) return;
    modalLastFocused = document.activeElement;

    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');

    const name = card?.dataset?.name || card?.querySelector('h3')?.textContent || 'Товар';
    const desc = card?.dataset?.desc || card?.querySelector('p')?.textContent || '';
    const price = card?.dataset?.price || card?.querySelector('.price')?.textContent || '';
    const img = card?.dataset?.img || card?.querySelector('img')?.src || '';

    if (modalImg) { modalImg.src = img; modalImg.alt = name; }
    if (modalTitle) modalTitle.textContent = name;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalPrice) modalPrice.textContent = price;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll();
    modalFocusCleanup = createFocusTrap(modal);
    if (modalClose) modalClose.focus();
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (typeof modalFocusCleanup === 'function') { modalFocusCleanup(); modalFocusCleanup = null; }
    unlockScroll();
    if (modalLastFocused && typeof modalLastFocused.focus === 'function') modalLastFocused.focus();
}

// открытие при клике на карточку (игнорируем клик по кнопке добавления в корзину)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
        if (e.target.closest('.add-to-cart')) return;
        playSound('click');
        openModal(card);
    });
});

if (modalClose) modalClose.addEventListener('click', () => { playSound('click'); closeModal(); });
if (modal) {
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (modal && modal.classList.contains('active')) closeModal(); } });

// ===== Корзина =====
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartCheckout = document.getElementById('cart-checkout');
let cartFocusCleanup = null;
let cartLastFocused = null;

function openCart() {
    if (!cartOverlay) return;
    cartLastFocused = document.activeElement;
    playSound('click');
    cartOverlay.classList.add('active');
    lockScroll();
    cartOverlay.setAttribute('aria-hidden', 'false');
    cartFocusCleanup = createFocusTrap(cartOverlay);
    cartOverlay.querySelector('button')?.focus();
}

function closeCart() {
    if (!cartOverlay) return;
    cartOverlay.classList.remove('active');
    cartOverlay.setAttribute('aria-hidden', 'true');
    if (typeof cartFocusCleanup === 'function') { cartFocusCleanup(); cartFocusCleanup = null; }
    unlockScroll();
    if (cartLastFocused && typeof cartLastFocused.focus === 'function') cartLastFocused.focus();
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', () => { playSound('click'); closeCart(); });
if (cartOverlay) cartOverlay.addEventListener('click', e => { if (e.target === cartOverlay) closeCart(); });

// ===== Обновление корзины =====
function updateCart() {
    if (!cartCount || !cartItems || !cartTotal) return;
    const totalQty = cart.reduce((s, it) => s + it.qty, 0);
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

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.onclick = () => {
            playSound('click');
            const index = parseInt(btn.dataset.index);
            if (!Number.isFinite(index)) return;
            if (cart[index].qty > 1) cart[index].qty -= 1; else cart.splice(index, 1);
            updateCart();
        };
    });
}

function addToCart(name, price, img, btn) {
    playSound('add');
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty += 1; else cart.push({ name, price, img, qty: 1 });
    updateCart();
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Добавлено ✓';
        btn.classList.add('added');
        setTimeout(() => { btn.textContent = originalText || 'В корзину'; btn.classList.remove('added'); }, 1400);
    }
}

// Кнопки "В корзину"
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const card = this.closest('.card');
        if (card) {
            addToCart(card.dataset.name || card.querySelector('h3')?.textContent || 'Товар', card.dataset.price || card.querySelector('.price')?.textContent || '0 ₽', card.dataset.img || card.querySelector('img')?.src || '', this);
            return;
        }
        const title = document.getElementById('modal-title');
        const price = document.getElementById('modal-price');
        const img = document.getElementById('modal-img');
        if (title && price && img) addToCart(title.textContent, price.textContent, img.src, this);
    });
});

// ===== Оформление + Чек =====
const receiptOverlay = document.getElementById('receipt-overlay');
const receiptBody = document.getElementById('receipt-body');
const receiptTotal = document.getElementById('receipt-total');
const receiptClose = document.getElementById('receipt-close');
let receiptFocusCleanup = null;
let receiptLastFocused = null;

if (cartCheckout) {
    cartCheckout.addEventListener('click', () => {
        if (cart.length === 0) { alert('Корзина пуста'); return; }
        playSound('success');

        let total = 0;
        if (receiptBody) receiptBody.innerHTML = '';

        cart.forEach(item => {
            const priceNum = parseInt(String(item.price).replace(/\D/g, '')) || 0;
            const lineTotal = priceNum * item.qty;
            total += lineTotal;
            const row = document.createElement('div');
            row.className = 'receipt-item';
            row.innerHTML = `<span>${item.name}${item.qty > 1 ? ` ×${item.qty}` : ''}</span><span>${lineTotal} ₽</span>`;
            receiptBody?.appendChild(row);
        });
        if (receiptTotal) receiptTotal.textContent = total + ' ₽';

        // Закрыть корзину и открыть чек
        closeCart();
        if (receiptOverlay) {
            receiptLastFocused = document.activeElement;
            receiptOverlay.classList.add('active');
            lockScroll();
            receiptOverlay.setAttribute('aria-hidden', 'false');
            receiptFocusCleanup = createFocusTrap(receiptOverlay);
            receiptOverlay.querySelector('button')?.focus();
        }

        // очистить корзину
        cart = [];
        updateCart();
    });
}

if (receiptClose) receiptClose.addEventListener('click', () => { playSound('click'); if (receiptOverlay) { receiptOverlay.classList.remove('active'); receiptOverlay.setAttribute('aria-hidden', 'true'); } if (typeof receiptFocusCleanup === 'function') { receiptFocusCleanup(); receiptFocusCleanup = null; } unlockScroll(); if (receiptLastFocused) receiptLastFocused.focus(); });
if (receiptOverlay) receiptOverlay.addEventListener('click', e => { if (e.target === receiptOverlay) { receiptOverlay.classList.remove('active'); receiptOverlay.setAttribute('aria-hidden', 'true'); if (typeof receiptFocusCleanup === 'function') { receiptFocusCleanup(); receiptFocusCleanup = null; } unlockScroll(); if (receiptLastFocused) receiptLastFocused.focus(); } });

// ===== Escape: закрываем все оверлеи безопасно =====
document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modal && modal.classList.contains('active')) closeModal();
    if (cartOverlay && cartOverlay.classList.contains('active')) closeCart();
    if (receiptOverlay && receiptOverlay.classList.contains('active')) {
        receiptOverlay.classList.remove('active');
        receiptOverlay.setAttribute('aria-hidden', 'true');
        if (typeof receiptFocusCleanup === 'function') { receiptFocusCleanup(); receiptFocusCleanup = null; }
        unlockScroll();
    }
});

updateCart();
