// Бургер меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('open');
    });
});

// Кнопки "В корзину"
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        this.textContent = 'Добавлено ✓';
        this.classList.add('added');

        // Через 2 секунды возвращаем обратно
        setTimeout(() => {
            this.textContent = 'В корзину';
            this.classList.remove('added');
        }, 2000);
    });
});
