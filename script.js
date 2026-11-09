//смуз листалка при клике
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

//открытие коллапс панели
function togglePanel(btn) {
    const collapspanel = btn.nextElementSibling;
    collapspanel.classList.toggle('open');
}

//счетчик всего\осталось 
let currentGallery = [];
let currentIndex = 0;
let currentGalleryEl = null;


function openMedia(type, src, index, galleryId) {
    lockScroll();
    
    currentIndex = index;
    
    const gallery = document.getElementById(galleryId);
    currentGalleryEl = gallery;
    const items = gallery.querySelectorAll('.gallery-item');
    
    currentGallery = Array.from(items).map(item => {
        const onclickAttr = item.getAttribute('onclick');
        const typeMatch = onclickAttr.match(/'([^']+)'/g);
        
        const mediaNameElement = item.querySelector('.media-name');
        const caption = mediaNameElement ? mediaNameElement.textContent : '';
        
        return {
            type: typeMatch ? typeMatch[0].replace(/'/g, '') : 'image',
            src: typeMatch ? typeMatch[1].replace(/'/g, '') : '',
            caption: caption  
        };
    });
    
    createModal(currentIndex);
}

function createModal(index) {
    const existingModal = document.querySelector('.media-modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }
    
    const modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.style.display = 'flex';
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            unlockScroll();
            document.body.removeChild(modal);
        }
    };
    
    //контейнер для контента
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'modal-content-wrapper';
    contentWrapper.style.cssText = `
        position: relative;
        max-width: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    `;
    
    //контент
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.id = 'modal-content';
    content.style.cssText = `
        max-width: 100%;
        max-height: 100%;
    `;
    
    updateModalContent(content, index);
    
    // Подпись под контентом
    const caption = document.createElement('div');
    caption.className = 'modal-caption';
    caption.style.cssText = `
        text-align: center;
        color: white;
        padding: 5px 0;
        font-size: 16px;
    `;
    caption.textContent = currentGallery[index].caption;
    
    //кнопки навигации
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn prev';
    prevBtn.innerHTML = '❮';
    prevBtn.onclick = function(e) {
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            updateModalContent(content, currentIndex);
            caption.textContent = currentGallery[currentIndex].caption;  // Обновляем подпись
            updateCounter(counter, currentIndex);
            updateNavButtons(prevBtn, nextBtn);
        }
    };
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-btn next';
    nextBtn.innerHTML = '❯';
    nextBtn.onclick = function(e) {
        e.stopPropagation();
        if (currentIndex < currentGallery.length - 1) {
            currentIndex++;
            updateModalContent(content, currentIndex);
            caption.textContent = currentGallery[currentIndex].caption;  // Обновляем подпись
            updateCounter(counter, currentIndex);
            updateNavButtons(prevBtn, nextBtn);
        }
    };
    
    function updateNavButtons(prev, next) {
        prev.disabled = currentIndex === 0;
        next.disabled = currentIndex === currentGallery.length - 1;
        prev.style.opacity = currentIndex === 0 ? '0.5' : '1';
        prev.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        next.style.opacity = currentIndex === currentGallery.length - 1 ? '0.5' : '1';
        next.style.cursor = currentIndex === currentGallery.length - 1 ? 'not-allowed' : 'pointer';
    }
    
    //счетчик
    const counter = document.createElement('div');
    counter.className = 'image-counter';
    function updateCounter(counter, index) {
        counter.textContent = `${index + 1} / ${currentGallery.length}`;
    }
    updateCounter(counter, index);
    
    //кнопка закрытия
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function(e) {
        e.stopPropagation();
        unlockScroll();
        document.body.removeChild(modal);
    };
    

    contentWrapper.appendChild(caption);
    contentWrapper.appendChild(content);
    contentWrapper.appendChild(prevBtn);
    contentWrapper.appendChild(nextBtn);
    contentWrapper.appendChild(counter);
    contentWrapper.appendChild(closeBtn);
    modal.appendChild(contentWrapper);
    
    updateNavButtons(prevBtn, nextBtn);
    
    //ESC и стрелки
    document.addEventListener('keydown', function(e) {
        if (!document.body.contains(modal)) return;
        
        if (e.key === 'Escape') {
            unlockScroll();
            document.body.removeChild(modal);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            currentIndex--;
            updateModalContent(content, currentIndex);
            caption.textContent = currentGallery[currentIndex].caption; 
            updateCounter(counter, currentIndex);
            updateNavButtons(prevBtn, nextBtn);
        } else if (e.key === 'ArrowRight' && currentIndex < currentGallery.length - 1) {
            e.preventDefault();
            currentIndex++;
            updateModalContent(content, currentIndex);
            caption.textContent = currentGallery[currentIndex].caption;
            updateCounter(counter, currentIndex);
            updateNavButtons(prevBtn, nextBtn);
        }
    });
    
    document.body.appendChild(modal);
}

//функция обновления контента в модальном окне
function updateModalContent(content, index, captionEl) {
    content.innerHTML = '';

    const item = currentGallery[index];
    if (!item) return;

    if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = `Изображение ${index + 1}`;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '80vh';
        img.style.display = 'block';
        content.appendChild(img);
    } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '80vh';

        const source = document.createElement('source');
        source.src = item.src;
        source.type = 'video/mp4';

        video.appendChild(source);
        content.appendChild(video);
    }

    if (captionEl && currentGalleryEl) {
        const mediaNames = currentGalleryEl.querySelectorAll('.media-name');
        const captionText = mediaNames[index]?.textContent.trim() || '';
        captionEl.textContent = captionText;
        captionEl.style.display = captionText ? 'block' : 'none';
    }
}

//блок скролла
function lockScroll() {
    document.body.style.overflow = 'hidden';
}

//анблок скролла
function unlockScroll() {
    document.body.style.overflow = '';
}

// ============================================================
//  i18n: ручной словарь на JSON + Vanilla JS
// ============================================================

const DEFAULT_LANG = 'ru';
const SUPPORTED_LANGS = ['ru', 'en'];
const STORAGE_KEY = 'portfolio-lang';
const IS_LOCAL = window.location.protocol === 'file:';

let translations = {};   // сюда загрузим JSON
let currentLang = DEFAULT_LANG;

/**
 * Загружает JSON с переводами.
 * Используем fetch — работает и локально через http-сервер,
 * и на GitHub Pages.
 */
async function loadTranslations() {
    if (IS_LOCAL) return;
    try {        
        // кэш-бастинг не нужен, но если будешь часто менять — можно добавить ?v=Date.now()
        const response = await fetch('./translations.json?v=' + Date.now(), { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        translations = await response.json();        
    } catch (err) {
        console.error('Не удалось загрузить translations.json:', err);
    }
}

/**
 * Применяет переводы к странице.
 * Для каждого элемента с [data-i18n] берём ключ и подставляем текст.
 */
function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) {
        console.warn(`Нет переводов для языка: ${lang}`);
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = dict[key];
        if (value !== undefined) {
            el.textContent = value;
        } else {
            console.warn(`Отсутствует ключ "${key}" для языка "${lang}"`);
        }
    });

    // Для текстов с разметкой (<br>, <h4> и т.п.) используем data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const value = dict[key];
        if (value !== undefined) {
            el.innerHTML = value;
        } else {
            console.warn(`Отсутствует ключ "${key}" для языка "${lang}"`);
        }
    });

    // Меняем атрибут lang у <html> — полезно для SEO и скринридеров
    document.documentElement.lang = lang;

    // Обновляем подпись кнопки (показываем язык, на который переключимся)
    const btn = document.getElementById('langToggle');
    if (btn) {
        btn.textContent = lang === 'ru' ? 'EN' : 'RU';
    }
}

/**
 * Устанавливает язык: применяет перевод и сохраняет выбор.
 */
function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    applyTranslations(lang);
    localStorage.setItem(STORAGE_KEY, lang);
}

/**
 * Определяет стартовый язык:
 * 1) сохранённый в localStorage
 * 2) язык браузера
 * 3) DEFAULT_LANG
 */
function detectInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

    const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

    return DEFAULT_LANG;
}

/**
 * Переключатель по клику на кнопку.
 */
function initLangToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;

    if (IS_LOCAL) {
        btn.style.display = 'none';
        return;
    }

    btn.addEventListener('click', () => {
        const next = currentLang === 'ru' ? 'en' : 'ru';
        setLanguage(next);
    });
}

/**
 * Точка входа.
 */
async function initI18n() {
    if(IS_LOCAL){
        // Локально — просто оставляем HTML как есть, ничего не трогаем
        console.info('Локальный режим (file://): i18n отключён, кнопка скрыта.');
        return;
    }
    await loadTranslations();
    initLangToggle();
    setLanguage(detectInitialLang());
}

// Ждём DOM, затем инициализируем
document.addEventListener('DOMContentLoaded', initI18n);