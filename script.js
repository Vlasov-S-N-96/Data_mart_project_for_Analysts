// Бургер-меню для мобильной версии
(function() {
    function initBurgerMenu() {
        const burgerBtn = document.getElementById('burgerBtn');
        const mobileNav = document.getElementById('mobileNav');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (!burgerBtn || !mobileNav || !menuOverlay) return;
        
        function toggleMenu() {
            burgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        }
        
        function closeMenu() {
            if (mobileNav.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        burgerBtn.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', closeMenu);
        
        document.querySelectorAll('.mobile-nav .nav-btn').forEach(link => {
            link.addEventListener('click', function(e) {
                closeMenu();
                const targetId = this.getAttribute('href');
                if (targetId?.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initBurgerMenu) : initBurgerMenu();
})();

// ===== АКТИВАЦИЯ КНОПОК НАВИГАЦИИ ПРИ СКРОЛЛЕ =====
(function() {
    function initNavHighlight() {
        const sections = document.querySelectorAll('section');
        const navBtns = document.querySelectorAll('.nav-buttons .nav-btn');
        if (!sections.length || !navBtns.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navBtns.forEach(btn => {
                        btn.classList.toggle('active', btn.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.4 });
        
        sections.forEach(section => observer.observe(section));
    }
    
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initNavHighlight) : initNavHighlight();
})();

// ===== ПЛАВНАЯ ПРОКРУТКА ДЛЯ ДЕСКТОПНЫХ КНОПОК =====
(function() {
    function initSmoothScroll() {
        document.querySelectorAll('.nav-buttons .nav-btn').forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId?.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initSmoothScroll) : initSmoothScroll();
})();

// ===== АККОРДЕОН ДЛЯ ЭТАПОВ =====
(function() {
    function initAccordions() {
        const stageGroups = document.querySelectorAll('.stage-group');
        
        stageGroups.forEach(group => {
            // По умолчанию все аккордеоны закрыты
            group.classList.remove('open');
            
            const header = group.querySelector('.stage-header');
            if (header) {
                header.addEventListener('click', function() {
                    // Переключаем класс open
                    group.classList.toggle('open');
                });
            }
        });
    }
    
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initAccordions) : initAccordions();
})();

// ===== СЛАЙДЕРЫ =====
(function() {
    function initSlider(sliderId, prevBtnId, nextBtnId, dotsId) {
        const track = document.getElementById(sliderId);
        const slides = track?.querySelectorAll('.slider-slide');
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const dotsContainer = document.getElementById(dotsId);
        
        if (!track || !slides?.length) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
        }
        
        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });
        
        createDots();
    }
    
    document.readyState === 'loading' 
        ? document.addEventListener('DOMContentLoaded', () => {
            initSlider('sparkSlider', 'prevSparkBtn', 'nextSparkBtn', 'sparkDots');
            initSlider('sqlSlider', 'prevSqlBtn', 'nextSqlBtn', 'sqlDots');
        })
        : (() => {
            initSlider('sparkSlider', 'prevSparkBtn', 'nextSparkBtn', 'sparkDots');
            initSlider('sqlSlider', 'prevSqlBtn', 'nextSqlBtn', 'sqlDots');
        })();
})();
