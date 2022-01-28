'use strict';

const addTd = (tr, text, link) => {
  const td = document.createElement('td');
  const textNode = document.createTextNode(text);
  let content;
  if (link == null) {
    content = textNode;
  } else {
    content = document.createElement('a');
    content.href = link;
    content.appendChild(textNode);
  }
  td.appendChild(content);
  tr.appendChild(td);
};

const tbody = document.getElementById('tbody');
const searchInput = document.getElementById('search-input');

// 検索処理
const getArticles = async () => {
  while (tbody.firstChild != null) {
    tbody.removeChild(tbody.firstChild);
  }
  const criteria = searchInput.value;
  const response = await fetchWithJwt(`/api/articles?criteria=${criteria}`);
  if (response.ok === false) {
    return;
  }
  const articles = await response.json();
  for (const { id, title, username, createdAt, updatedAt } of articles) {
    const tr = document.createElement('tr');

    addTd(tr, title, `/detail.html?id=${id}`);
    addTd(tr, username);
    addTd(tr, new Date(createdAt).toLocaleString());
    addTd(tr, new Date(updatedAt).toLocaleString());

    tbody.appendChild(tr);
  }
};

// 初回の検索
getArticles();

// 検索フォームが送信されたら検索
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  getArticles();
});

const form = document.getElementById('form');
const titleInput = document.getElementById('title');
const textarea = document.getElementById('textarea');
textarea.addEventListener('input', () => {
  const lineCount = textarea.value.split('\n').length;
  if (lineCount >= 5) {
    textarea.rows = lineCount;
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const title = titleInput.value;
  const text = textarea.value;
  const response = await fetchWithJwt('/api/articles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, text }),
  });
  if (response.ok === true) {
    titleInput.value = '';
    textarea.value = '';
    textarea.rows = 5;
    await getArticles();
  }
});
