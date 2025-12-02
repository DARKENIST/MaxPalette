
// Проверка авторизации при загрузке страницы
function updateNavigation() {
    const user = JSON.parse(localStorage.getItem('artspace_user'));
    const loginButton = document.getElementById('loginButton');
    const userDropdown = document.getElementById('userDropdown');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const logoutSection = document.getElementById('logoutSection');
    
    if (user && user.isLoggedIn) {
        // Пользователь авторизован
        if (loginButton) {
            loginButton.innerHTML = `
                <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" 
                     class="w-6 h-6 rounded-full mr-2 object-cover">
                <span>${user.name || 'Пользователь'}</span>
                <i class="fas fa-chevron-down ml-2 text-sm"></i>
            `;
        }
        
        if (userInfo && userName && userEmail) {
            userInfo.classList.remove('hidden');
            userName.textContent = user.name || 'Пользователь';
            userEmail.textContent = user.email || '';
        }
        
        if (logoutSection) {
            logoutSection.classList.remove('hidden');
        }
    } else {
        // Пользователь не авторизован
        if (loginButton) {
            loginButton.innerHTML = `
                <i class="fas fa-sign-in-alt"></i>
                <span>Войти</span>
            `;
        }
        
        if (logoutSection) {
            logoutSection.classList.add('hidden');
        }
        
        if (userInfo) {
            userInfo.classList.add('hidden');
        }
    }
}

// Обработчик для кнопки входа
function setupLoginButton() {
    const loginButton = document.getElementById('loginButton');
    
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            const user = JSON.parse(localStorage.getItem('artspace_user'));
            
            if (user && user.isLoggedIn) {
                // Если пользователь авторизован, показать/скрыть dropdown
                const dropdown = document.getElementById('userDropdown');
                dropdown.classList.toggle('hidden');
                e.stopPropagation();
            } else {
                // Если не авторизован, перейти на страницу входа
                window.location.href = 'login.html';
            }
        });
    }
}

// Обработчик для кнопки выхода
function setupLogoutButton() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Удалить данные пользователя
            localStorage.removeItem('artspace_user');
            localStorage.removeItem('artspace_remember');
            
            // Обновить навигацию
            updateNavigation();
            
            // Показать сообщение
            showLogoutMessage();
            
            // Скрыть dropdown
            document.getElementById('userDropdown').classList.add('hidden');
        });
    }
}

// Показать сообщение о выходе
function showLogoutMessage() {
    // Создать элемент для сообщения
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-50 text-green-700 border border-green-200 rounded-lg p-4 shadow-lg z-50 animate-slide-in';
    message.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>Вы успешно вышли из системы</span>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Удалить сообщение через 3 секунды
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// CSS анимация для сообщения
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Закрытие dropdown при клике вне его
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('userDropdown');
    const loginButton = document.getElementById('loginButton');
    
    if (dropdown && !dropdown.contains(event.target) && loginButton && !loginButton.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновить навигацию
    updateNavigation();
    
    // Настроить кнопки
    setupLoginButton();
    setupLogoutButton();
    
    // Проверить, если пользователь был перенаправлен после логина
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
        showLoginSuccessMessage();
    }
});

// Показать сообщение об успешном входе (если перенаправлены)
function showLoginSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-50 text-green-700 border border-green-200 rounded-lg p-4 shadow-lg z-50 animate-slide-in';
    message.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>Добро пожаловать в ArtSpace!</span>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Удалить сообщение через 3 секунды
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    // Убрать параметр из URL
    window.history.replaceState({}, document.title, window.location.pathname);
}