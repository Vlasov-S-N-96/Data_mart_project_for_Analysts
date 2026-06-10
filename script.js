// Бургер-меню для мобильной версии
(function() {
    function initBurgerMenu() {
        const burgerBtn = document.getElementById('burgerBtn');
        const mobileNav = document.getElementById('mobileNav');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (!burgerBtn || !mobileNav || !menuOverlay) {
            console.error('❌ Элементы бургер-меню не найдены');
            return;
        }
        
        function toggleMenu() {
            burgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                burgerBtn.innerHTML = '✕ Закрыть';
            } else {
                document.body.style.overflow = '';
                burgerBtn.innerHTML = '☰ Меню';
            }
        }
        
        function closeMenu() {
            if (mobileNav.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
                burgerBtn.innerHTML = '☰ Меню';
            }
        }
        
        burgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        menuOverlay.addEventListener('click', closeMenu);
        
        const mobileLinks = mobileNav.querySelectorAll('.nav-btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                closeMenu();
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBurgerMenu);
    } else {
        initBurgerMenu();
    }
})();

// Аккордеон для этапов
(function() {
    function initAccordion() {
        const groups = document.querySelectorAll('.stage-group');
        
        groups.forEach(group => {
            const header = group.querySelector('.stage-header');
            const toggleBtn = group.querySelector('.toggle-btn');
            
            if (!header) return;
            
            function toggle() {
                group.classList.toggle('collapsed');
            }
            
            header.addEventListener('click', (e) => {
                if (toggleBtn && (e.target === toggleBtn || toggleBtn.contains(e.target))) {
                    return;
                }
                toggle();
            });
            
            if (toggleBtn) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggle();
                });
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccordion);
    } else {
        initAccordion();
    }
})();

// Универсальный слайдер
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
    
    function updateSlider() {
        const container = track.parentElement;
        const slideWidth = container.clientWidth;
        const newTransform = -currentIndex * slideWidth;
        track.style.transform = `translateX(${newTransform}px)`;
        
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
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        updateSlider();
    });
    
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
    
    window.addEventListener('resize', () => {
        setTimeout(updateSlider, 100);
    });
    
    setTimeout(updateSlider, 100);
}

// Lightbox для изображений
function initLightbox() {
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
    
    const style = document.createElement('style');
    style.textContent = `
        #lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            visibility: hidden;
            opacity: 0;
            transition: visibility 0.3s, opacity 0.3s;
        }
        #lightbox.active { visibility: visible; opacity: 1; }
        .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.92);
        }
        .lightbox-content {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .lightbox-image {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
        }
        .lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            z-index: 2001;
        }
        .lightbox-close:hover { color: #ffb347; }
        .lightbox-prev, .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.6);
            border: none;
            color: white;
            font-size: 36px;
            cursor: pointer;
            padding: 15px 20px;
            border-radius: 50%;
            transition: all 0.2s;
        }
        .lightbox-prev:hover, .lightbox-next:hover { background: #ffb347; color: #1e4663; }
        .lightbox-prev { left: 20px; }
        .lightbox-next { right: 20px; }
        @media (max-width: 768px) {
            .lightbox-prev, .lightbox-next { padding: 10px 15px; font-size: 24px; }
            .lightbox-close { font-size: 30px; top: 10px; right: 15px; }
        }
    `;
    document.head.appendChild(style);
    
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
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentImages.length - 1;
        lightboxImg.src = currentImages[currentIndex];
    }
    
    function nextImage() {
        currentIndex = (currentIndex < currentImages.length - 1) ? currentIndex + 1 : 0;
        lightboxImg.src = currentImages[currentIndex];
    }
    
    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
    
    document.querySelectorAll('.slider-track').forEach(slider => {
        const slides = slider.querySelectorAll('.slider-slide');
        const images = Array.from(slides).map(slide => {
            const img = slide.querySelector('img');
            return img ? img.src : null;
        }).filter(src => src);
        
        slides.forEach((slide, idx) => {
            const newSlide = slide.cloneNode(true);
            slide.parentNode.replaceChild(newSlide, slide);
            newSlide.addEventListener('click', () => openLightbox(images, idx));
        });
    });
    
    document.querySelectorAll('.single-screenshot').forEach(el => {
        const img = el.querySelector('img');
        if (img) {
            const newEl = el.cloneNode(true);
            el.parentNode.replaceChild(newEl, el);
            newEl.addEventListener('click', () => openLightbox([img.src], 0));
        }
    });
}

// Функция для добавления кнопок копирования в блоки кода
(function() {
    function addCopyButtons() {
        // Находим все блоки кода
        const codeBlocks = document.querySelectorAll('.code-block, .details-block');
        
        codeBlocks.forEach(block => {
            // Находим pre внутри блока
            const pre = block.querySelector('pre');
            if (!pre) return;
            
            // Проверяем, есть ли уже обертка
            if (pre.parentElement.classList && pre.parentElement.classList.contains('code-wrapper')) return;
            if (block.querySelector('.code-header')) return;
            
            const code = pre.querySelector('code');
            if (!code) return;
            
            // Создаем обертку
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            
            // Создаем хедер с кнопкой
            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = '<button class="copy-btn">Копировать</button>';
            
            // Заменяем pre на wrapper и перемещаем pre внутрь
            const parent = pre.parentNode;
            parent.insertBefore(wrapper, pre);
            wrapper.appendChild(header);
            wrapper.appendChild(pre);
            
            // Добавляем обработчик копирования
            const copyBtn = header.querySelector('.copy-btn');
            copyBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                let codeText = code.textContent || code.innerText;
                codeText = codeText.trim();
                
                try {
                    await navigator.clipboard.writeText(codeText);
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '✅ Скопировано!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = 'Копировать';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    copyBtn.innerHTML = '❌ Ошибка';
                    setTimeout(() => {
                        copyBtn.innerHTML = 'Копировать';
                    }, 2000);
                }
            });
        });
    }
    
    // Запускаем после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCopyButtons);
    } else {
        addCopyButtons();
    }
})();



// Запуск всех компонентов
window.addEventListener('load', () => {
    initSlider('sparkSlider', 'prevSparkBtn', 'nextSparkBtn', 'sparkDots');
    initSlider('sqlSlider', 'prevSqlBtn', 'nextSqlBtn', 'sqlDots');
    initLightbox();
});
