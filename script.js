// Бургер-меню
const burgerBtn = document.getElementById('burgerBtn');
const tocMenu = document.getElementById('tocMenu');
if (burgerBtn && tocMenu) {
    burgerBtn.addEventListener('click', () => {
        tocMenu.classList.toggle('open');
    });
    tocMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            tocMenu.classList.remove('open');
        });
    });
}

// Сворачивание блоков этапов
document.querySelectorAll('.stage-group').forEach(group => {
    const header = group.querySelector('.stage-header');
    const toggleBtn = group.querySelector('.toggle-btn');
    const toggle = () => group.classList.toggle('collapsed');
    if (header) header.addEventListener('click', (e) => {
        if (e.target === toggleBtn || toggleBtn?.contains(e.target)) return;
        toggle();
    });
    if (toggleBtn) toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggle();
    });
});

// Слайдер - исправленная версия
function initSlider(trackId, prevId, nextId, dotsId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);
    
    if (!track || !prevBtn || !nextBtn) return;
    
    const slides = track.querySelectorAll('.slider-slide');
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let startX = 0;
    
    // Функция обновления слайдера
    function updateSlider() {
        const slideWidth = track.parentElement.clientWidth;
        const newTransform = -currentIndex * slideWidth;
        track.style.transform = `translateX(${newTransform}px)`;
        
        // Обновляем dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            });
        }
    }
    
    // Кнопка "назад"
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = slides.length - 1;
        }
        updateSlider();
    });
    
    // Кнопка "вперед"
    nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    });
    
    // Свайп для мобильных
    track.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].screenX;
        const diff = endX - startX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                prevBtn.click();
            } else {
                nextBtn.click();
            }
        }
    });
    
    // Обновление при изменении размера окна
    window.addEventListener('resize', () => {
        updateSlider();
    });
    
    // Небольшая задержка для корректного расчета ширины
    setTimeout(updateSlider, 100);
}

// Lightbox
function initLightbox() {
    // Удаляем старый lightbox если есть
    const oldLightbox = document.getElementById('lightbox');
    if (oldLightbox) oldLightbox.remove();
    
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-prev">❮</button>
            <img class="lightbox-image" src="" alt="">
            <button class="lightbox-next">❯</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const overlay = lightbox.querySelector('.lightbox-overlay');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    
    let currentImages = [];
    let currentIndex = 0;
    
    function openLightbox(images, index) {
        currentImages = images;
        currentIndex = index;
        lightboxImg.src = currentImages[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function prevImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImages.length - 1;
        lightboxImg.src = currentImages[currentIndex];
    }
    
    function nextImage() {
        if (currentImages.length === 0) return;
        currentIndex = (currentIndex < currentImages.length - 1) ? currentIndex + 1 : 0;
        lightboxImg.src = currentImages[currentIndex];
    }
    
    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });
    
    // Клавиатура
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
    
    // Для слайдеров - собираем все src
    document.querySelectorAll('.slider-track').forEach(slider => {
        const slides = slider.querySelectorAll('.slider-slide');
        const images = Array.from(slides).map(slide => {
            const img = slide.querySelector('img');
            return img ? img.src : null;
        }).filter(src => src);
        
        slides.forEach((slide, idx) => {
            // Убираем старые обработчики
            const newSlide = slide.cloneNode(true);
            slide.parentNode.replaceChild(newSlide, slide);
            newSlide.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(images, idx);
            });
        });
    });
    
    // Для одиночных скриншотов
    document.querySelectorAll('.single-screenshot').forEach(el => {
        const img = el.querySelector('img');
        if (img) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
            newEl.addEventListener('click', () => {
                openLightbox([img.src], 0);
            });
        }
    });
}

// Инициализация после полной загрузки страницы
window.addEventListener('load', () => {
    initSlider('sparkSlider', 'prevSparkBtn', 'nextSparkBtn', 'sparkDots');
    initSlider('sqlSlider', 'prevSqlBtn', 'nextSqlBtn', 'sqlDots');
    initLightbox();
});