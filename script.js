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
      setTimeout(() => { osc.frequency.value = 720; }, 100);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {}
}

// ===== Тема =====
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'light';
body.classList.remove('light', 'dark');
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

// ===== Бургер =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    playSound('click');
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      playSound('click');
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// ===== Лого =====
const logo = document.getElementById('logo');
if (logo) {
  logo.addEventListener('click', e => {
    const href = logo.getAttribute('href');
    if (href === '#' || href === '' || href === null) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    playSound('click');
  });
}

// ===== Табы (только на главной) =====
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

function openModal(card) {
  if (!modal) return;
  const img = document.getElementById('modal-img');
  const title = document.getElementById('modal-title');
  const desc = document.getElementById('modal-desc');
  const price = document.getElementById('modal-price');
  if (img) img.src = card.dataset.img || '';
  if (title) title.textContent = card.dataset.name || '';
  if (desc) desc.textContent = card.dataset.desc || '';
  if (price) price.textContent = card.dataset.price || '';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.add-to-cart')) return;
    playSound('click');
    openModal(card);
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => {
    playSound('click');
    closeModal();
  });
}
if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
}

// ===== Корзина =====
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const cartCloseBtn = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartCheckout = document.getElementById('cart-checkout');

function openCart() {
  if (!cartOverlay) return;
  playSound('click');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  if (!cartOverlay) return;
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartCloseBtn) {
  cartCloseBtn.addEventListener('click', () => {
    playSound('click');
    closeCart();
  });
}
if (cartOverlay) {
  cartOverlay.addEventListener('click', e => {
    if (e.target === cartOverlay) closeCart();
  });
}

function updateCart() {
  if (!cartCount || !cartItems || !cartTotal) return;
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

  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.onclick = () => {
      playSound('click');
      const index = parseInt(btn.dataset.index);
      if (cart[index].qty > 1) cart[index].qty -= 1;
      else cart.splice(index, 1);
      updateCart();
    };
  });
}

function addToCart(name, price, img, btn) {
  playSound('add');
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty += 1;
  else cart.push({ name, price, img, qty: 1 });
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

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const card = this.closest('.card');
    if (card) {
      addToCart(card.dataset.name, card.dataset.price, card.dataset.img, this);
      return;
    }
    const title = document.getElementById('modal-title');
    const price = document.getElementById('modal-price');
    const img = document.getElementById('modal-img');
    if (title && price && img) {
      addToCart(title.textContent, price.textContent, img.src, this);
    }
  });
});

// ===== Чек =====
const receiptOverlay = document.getElementById('receipt-overlay');
const receiptBody = document.getElementById('receipt-body');
const receiptTotalEl = document.getElementById('receipt-total');
const receiptClose = document.getElementById('receipt-close');

if (cartCheckout) {
  cartCheckout.addEventListener('click', () => {
    if (!cart.length) {
      alert('Корзина пуста');
      return;
    }
    if (!receiptOverlay || !receiptBody || !receiptTotalEl) {
      alert('Ошибка: блок чека не найден');
      return;
    }
    playSound('success');
    let total = 0;
    receiptBody.innerHTML = '';
    cart.forEach(item => {
      const priceNum = parseInt(String(item.price).replace(/\D/g, '')) || 0;
      const lineTotal = priceNum * (item.qty || 1);
      total += lineTotal;
      const row = document.createElement('div');
      row.className = 'receipt-item';
      row.innerHTML = `<span>${item.name}${item.qty > 1 ? ' ×' + item.qty : ''}</span><span>${lineTotal} ₽</span>`;
      receiptBody.appendChild(row);
    });
    receiptTotalEl.textContent = total + ' ₽';
    closeCart();
    receiptOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    cart = [];
    updateCart();
  });
}

if (receiptClose && receiptOverlay) {
  receiptClose.addEventListener('click', () => {
    playSound('click');
    receiptOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  receiptOverlay.addEventListener('click', e => {
    if (e.target === receiptOverlay) {
      receiptOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeCart();
    if (receiptOverlay) {
      receiptOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

updateCart();
