'use strict';

const form = document.getElementById('form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const response = await fetchWithJwt('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.ok === false) {
    return;
  }
  const { accessToken, username: resultUsername } = await response.json();
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('username', resultUsername);
  location.href = '/';
});
