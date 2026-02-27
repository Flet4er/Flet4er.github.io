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


function openMedia(type, src, index, galleryId) {
    lockScroll();
    
    currentIndex = index;
    

    const gallery = document.getElementById(galleryId);
    const items = gallery.querySelectorAll('.gallery-item');
    
    currentGallery = Array.from(items).map(item => {

        const onclickAttr = item.getAttribute('onclick');
        const typeMatch = onclickAttr.match(/'([^']+)'/g);
        
        return {
            type: typeMatch ? typeMatch[0].replace(/'/g, '') : 'image',
            src: typeMatch ? typeMatch[1].replace(/'/g, '') : ''
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
        max-width: 90%;
        max-height: 90%;
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
    
    //кнопки навигации
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-btn prev';
    prevBtn.innerHTML = '❮';
    prevBtn.onclick = function(e) {
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            updateModalContent(content, currentIndex);
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
    

    
    //modal (фон) -> contentWrapper (центр) -> остальное
    contentWrapper.appendChild(content);
    contentWrapper.appendChild(prevBtn);
    contentWrapper.appendChild(nextBtn);
    contentWrapper.appendChild(counter);
    contentWrapper.appendChild(closeBtn);

    
    modal.appendChild(contentWrapper);
    
    updateNavButtons(prevBtn, nextBtn);
    
    //ESC
    document.addEventListener('keydown', function(e) {
        if (!document.body.contains(modal)) return;
        
        if (e.key === 'Escape') {
            unlockScroll();
            document.body.removeChild(modal);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            currentIndex--;
            updateModalContent(content, currentIndex);
            updateCounter(counter, currentIndex);
            updateNavButtons(prevBtn, nextBtn);
        } else if (e.key === 'ArrowRight' && currentIndex < currentGallery.length - 1) {
            e.preventDefault();
            currentIndex++;
            updateModalContent(content, currentIndex);
            updateCounter(counter, currentIndex);
            updateNavButtons(prevBtn, nextBtn);
        }
    });
    
    document.body.appendChild(modal);
}

//функция обновления контента в модальном окне
function updateModalContent(content, index) {
    content.innerHTML = '';
    
    const item = currentGallery[index];
    
    if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = `Изображение ${index + 1}`;
        content.appendChild(img);
    } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        
        const source = document.createElement('source');
        source.src = item.src;
        source.type = 'video/mp4';
        
        video.appendChild(source);
        content.appendChild(video);
    }
    
}

//лево право клавиши
document.addEventListener('keydown', function(e) {
    const modal = document.querySelector('.media-modal');
    if (!modal) return;
    
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) {
        prevBtn.click();
    } else if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled) {
        nextBtn.click();
    }
});

//блок скролла
function lockScroll() {
    document.body.style.overflow = 'hidden';
}

//анблок скролла
function unlockScroll() {
    document.body.style.overflow = '';
}