'use strict';

const form = document.getElementById('form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const passwordConfirmInput = document.getElementById('password-confirm');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  if (password !== passwordConfirm) {
    alert('パスワードが一致しません。');
    return;
  }
  const response = await fetchWithJwt('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.ok === false) {
    return;
  }
  alert('ユーザー登録しました。');
  location.href = '/';
});
