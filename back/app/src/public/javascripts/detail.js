'use strict';

const id = Number(location.href.replace(/.*id=(\d+).*/, '$1'));
if (Number.isNaN(id)) {
  alert('URLにIDが正しく設定されていません。');
  location.href = '/';
}

const apiUrl = `/api/articles/${id}`;

const titleInput = document.getElementById('title');
const textarea = document.getElementById('textarea');

const adjustTextareaRow = () => {
  const lineCount = textarea.value.split('\n').length;
  if (lineCount >= 5) {
    textarea.rows = lineCount;
  }
};

textarea.addEventListener('input', adjustTextareaRow);

(async () => {
  const response = await fetchWithJwt(apiUrl);
  const { id, username, title, text, createdAt, updatedAt } = await response.json();
  document.getElementById('id-text').innerText = id;
  document.getElementById('username-text').innerText = username;
  const createdAtString = new Date(createdAt).toLocaleString();
  document.getElementById('created-at-text').innerText = createdAtString;
  const updatedAtString = new Date(updatedAt).toLocaleString();
  document.getElementById('updated-at-text').innerText = updatedAtString;
  titleInput.value = title;
  textarea.value = text;
  adjustTextareaRow();
})();

const form = document.getElementById('form');
const editButton = document.getElementById('edit-button');
const updateButton = document.getElementById('update-button');
const deleteButton = document.getElementById('delete-button');

editButton.addEventListener('click', event => {
  event.preventDefault();
  titleInput.disabled = false;
  textarea.disabled = false;
  updateButton.disabled = false;
  deleteButton.disabled = false;
  editButton.disabled = true;
});

deleteButton.addEventListener('click', async event => {
  event.preventDefault();
  if (confirm('削除しますか？') === false) {
    return;
  }
  const response = await fetchWithJwt(apiUrl, {
    method: 'DELETE',
  });
  if (response.ok === true) {
    location.href = '/';
  }
});

form.addEventListener('submit', async event => {
  event.preventDefault();

  const title = titleInput.value;
  const text = textarea.value;

  const response = await fetchWithJwt(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, text }),
  });
  if (response.ok === true) {
    location.href = '/';
  }
});
