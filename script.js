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

function togglePanel(btn) {
            const collapspanel = btn.nextElementSibling;

            collapspanel.classList.toggle('open');
        }

// Функция открытия медиа в полном размере
function openMedia(type, src) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'media-modal';
    modal.style.display = 'flex';
    
    // Создаем контент
    const content = document.createElement('div');
    content.className = 'modal-content';
    
    if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        content.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        
        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        
        video.appendChild(source);
        content.appendChild(video);
    }
    
    // Кнопка закрытия
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-modal';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Кнопка скачивания
    
    //const downloadBtn = document.createElement('a');
    //downloadBtn.className = 'download-btn';
    //.href = src;
    //downloadBtn.download = src.split('/').pop();
    //downloadBtn.innerHTML = '📥 Скачать';
    
    modal.appendChild(closeBtn);
    modal.appendChild(content);
    //modal.appendChild(downloadBtn);
    
    // Закрытие по клику на фон
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    });
    
    document.body.appendChild(modal);
}

