// Регистрация нового пользователя
async function handleRegistration(formData) {
    // Проверка, существует ли пользователь
    const existingUsers = JSON.parse(localStorage.getItem('artspace_users') || '[]');
    
    if (existingUsers.some(user => user.email === formData.email)) {
        return {
            success: false,
            message: 'Пользователь с таким email уже существует'
        };
    }
    
    // Добавить нового пользователя
    const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`,
        artworks: 0,
        followers: 0,
        likes: 0
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('artspace_users', JSON.stringify(existingUsers));
    
    // Автоматический вход после регистрации
    saveUserToStorage({
        ...newUser,
        token: 'user_token_' + Date.now(),
        isLoggedIn: true
    });
    
    return {
        success: true,
        user: newUser
    };
}

// Функция для проверки доступности имени пользователя
function isUsernameAvailable(username) {
    const users = JSON.parse(localStorage.getItem('artspace_users') || '[]');
    return !users.some(user => user.username === username);
}

// Функция для проверки доступности email
function isEmailAvailable(email) {
    const users = JSON.parse(localStorage.getItem('artspace_users') || '[]');
    return !users.some(user => user.email === email);
}
// Функция для показа/скрытия пароля
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Показать сообщение
function showMessage(message, type = 'error') {
    const container = document.getElementById('messageContainer');
    container.className = `p-4 rounded-lg ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`;
    container.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    container.classList.remove('hidden');
}

// Показать ошибку поля
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    
    const inputElement = document.getElementById(fieldId);
    inputElement.classList.add('border-red-500');
    inputElement.classList.remove('border-gray-300');
}

// Скрыть ошибку поля
function hideFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.classList.add('hidden');
    
    const inputElement = document.getElementById(fieldId);
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
}

// Сохранить данные в localStorage
function saveUserToStorage(userData) {
    localStorage.setItem('artspace_user', JSON.stringify(userData));
}

// Получить данные из localStorage
function getUserFromStorage() {
    const userData = localStorage.getItem('artspace_user');
    return userData ? JSON.parse(userData) : null;
}

// Выход из системы
function logout() {
    localStorage.removeItem('artspace_user');
    localStorage.removeItem('artspace_remember');
    window.location.href = 'index.html';
}

// Проверить авторизацию
function checkAuth() {
    const user = getUserFromStorage();
    return user !== null;
}

// Получить данные пользователя
function getCurrentUser() {
    return getUserFromStorage();
}

// Имитация запроса на сервер
function simulateServerRequest(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Тестовые учетные данные
            if (data.email === 'demo@artspace.com' && data.password === 'demo123') {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        email: data.email,
                        name: 'Демо Пользователь',
                        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                        role: 'artist',
                        joinDate: '2023-10-01'
                    },
                    token: 'demo_token_123456'
                });
            } else {
                reject({
                    success: false,
                    message: 'Неверный email или пароль'
                });
            }
        }, 1500); // Имитация задержки сети
    });
}

// Обработка отправки формы
async function handleLogin(event) {
    event.preventDefault();
    
    // Сброс ошибок
    hideFieldError('email');
    hideFieldError('password');
    
    // Получение данных формы
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Валидация
    let isValid = true;
    
    if (!email) {
        showFieldError('email', 'Email обязателен');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError('email', 'Введите корректный email');
        isValid = false;
    }
    
    if (!password) {
        showFieldError('password', 'Пароль обязателен');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('password', 'Пароль должен быть не менее 6 символов');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Показать индикатор загрузки
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    
    submitBtn.disabled = true;
    submitText.textContent = 'Вход...';
    submitSpinner.classList.remove('hidden');
    
    try {
        // Имитация запроса к серверу
        const response = await simulateServerRequest({ email, password });
        
        if (response.success) {
            // Сохранить данные пользователя
            saveUserToStorage({
                ...response.user,
                token: response.token,
                isLoggedIn: true,
                rememberMe: rememberMe
            });
            
            // Сохранить настройку "Запомнить меня"
            if (rememberMe) {
                localStorage.setItem('artspace_remember', 'true');
            } else {
                localStorage.removeItem('artspace_remember');
            }
            
            showMessage('Вход выполнен успешно! Перенаправление...', 'success');
            
            // Перенаправление через 1.5 секунды
            setTimeout(() => {
                window.location.href = 'myaccount.html';
            }, 1500);
            
        } else {
            showMessage(response.message || 'Ошибка входа');
            submitBtn.disabled = false;
            submitText.textContent = 'Войти';
            submitSpinner.classList.add('hidden');
        }
        
    } catch (error) {
        showMessage(error.message || 'Ошибка соединения с сервером');
        submitBtn.disabled = false;
        submitText.textContent = 'Войти';
        submitSpinner.classList.add('hidden');
    }
}

// Проверить сохраненные данные при загрузке
function checkRememberedUser() {
    const remember = localStorage.getItem('artspace_remember');
    const user = getUserFromStorage();
    
    if (remember === 'true' && user) {
        // Автоматический вход
        document.getElementById('email').value = user.email;
        document.getElementById('rememberMe').checked = true;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Назначение обработчиков
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    // Проверить сохраненного пользователя
    checkRememberedUser();
    
    // Добавить обработчики для валидации в реальном времени
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value.trim()) {
                hideFieldError('email');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value) {
                hideFieldError('password');
            }
        });
    }
    
    // Enter для отправки формы
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && loginForm) {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT' && activeElement.type !== 'submit') {
                event.preventDefault();
                handleLogin(event);
            }
        }
    });
});