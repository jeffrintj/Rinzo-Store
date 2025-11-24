const FORM_ID = 'login-form';

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return
}

function setStrengthBar(score) {
    const bar = document.getElementById('strength-bar');
    const pct = (score / 4) * 100;
    bar.style.width = pct + '%';
    if (score <= 1) bar.style.background = '#ff6b6b';
    else if (score === 2) bar.style.background = '#ffb86b';
    else if (score === 3) bar.style.background = '#c3e88d';
    else bar.style.background = '#4caf50';
}

function initLogin() {
    const form = document.getElementById(FORM_ID);
    const emailEl = document.getElementById('email');
    const pwdEl = document.getElementById('password');
    const toggle = document.getElementById('togglePwd');

    // show/hide password
    toggle.addEventListener('click', () => {
        if (pwdEl.type === 'password') {
            pwdEl.type = 'text';
            toggle.innerText = 'Hide';
        } else {
            pwdEl.type = 'password';
            toggle.innerText = 'Show';
        }
    });

    // submit handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailEl.value.trim();
        const pwd = pwdEl.value;
        let valid = true;

        if (!isValidEmail(email)) {
            emailEl.classList.add('is-invalid');
            valid = false;
        } else {
            emailEl.classList.remove('is-invalid');
        }

        if (pwd.length < 6) {
            pwdEl.classList.add('is-invalid');
            valid = false;
        } else {
            pwdEl.classList.remove('is-invalid');
        }

        if (!valid) return;

        // fake success: redirect to homepage
        window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', initLogin);