'use strict';

// 検索処理
(async () => {
  const addTd = (tr, text) => {
    const td = document.createElement('td');
    const textNode = document.createTextNode(text);
    td.appendChild(textNode);
    tr.appendChild(td);
  };

  const tbody = document.getElementById('tbody');

  const response = await fetchWithJwt('/api/users');
  if (response.ok === false) {
    return;
  }
  const users = await response.json();
  for (const { username, createdAt, updatedAt } of users) {
    const tr = document.createElement('tr');

    addTd(tr, username);
    addTd(tr, new Date(createdAt).toLocaleString());
    addTd(tr, new Date(updatedAt).toLocaleString());

    tbody.appendChild(tr);
  }
})();
