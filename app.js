const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const switchToLogin = document.getElementById('switchToLogin');
const switchToRegister = document.getElementById('switchToRegister');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const lixiContainer = document.getElementById('lixiContainer');
const getLixiBtn = document.getElementById('getLixiBtn');
const lixiKeyInput = document.getElementById('lixiKey');
const lixiResult = document.getElementById('lixiResult');

let users = JSON.parse(localStorage.getItem('users')) || [];
let lixiKeys = ['12345', '67890', 'ABCDE'];  // Các key hợp lệ để nhận Lixi

// Đăng ký
registerBtn.addEventListener('click', () => {
    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passwordRegister').value;
    const captcha = document.getElementById('captcha').value;

    if (!email || !password || !captcha) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    if (captcha !== '1234') {
        alert('Mã Captcha không đúng');
        return;
    }

    const user = { email, password };
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Đăng ký thành công!');
});

// Đăng nhập
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Đăng nhập thành công');
        lixiContainer.style.display = 'block';  // Hiển thị phần nhận Lixi sau khi đăng nhập
    } else {
        alert('Email hoặc mật khẩu không đúng');
    }
});

// Chuyển sang form đăng ký
switchToRegister.addEventListener('click', () => {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Chuyển sang form đăng nhập
switchToLogin.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Nhận Lixi
getLixiBtn.addEventListener('click', () => {
    const key = lixiKeyInput.value;

    if (!key) {
        alert('Vui lòng nhập key');
        return;
    }

    if (lixiKeys.includes(key)) {
        lixiResult.textContent = 'Chúc mừng bạn đã nhận được Lixi!';
    } else {
        lixiResult.textContent = 'Key không hợp lệ. Thử lại!';
    }
});
