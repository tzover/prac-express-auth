'use strict';

{
  const username = localStorage.getItem('username');
  const loginLink = document.getElementById('login-logout');
  if (username == null) {
    loginLink.innerText = 'ログイン';
    loginLink.href = '/login.html';
  } else {
    document.getElementById('username').innerText = `ようこそ${username}さん`;
    loginLink.innerText = 'ログアウト';
    loginLink.addEventListener('click', event => {
      event.preventDefault();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      location.href = '/';
    });
  }
}

const fetchWithJwt = async (url, options) => {
  if (options == null) {
    options = {};
  } else {
    options = { ...options };
  }
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken != null) {
    if (options.headers == null) {
      options.headers = {};
    }
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  const response = await fetch(url, options);
  if (response.ok === false) {
    const json = await response.json();
    alert(json.error.message);
  }
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
  }
  return response;
};

const logout = () => {
  localStorage.removeItem('accessToken');
};
