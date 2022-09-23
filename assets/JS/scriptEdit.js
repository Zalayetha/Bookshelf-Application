const form = document.getElementById('form-bookshelf');
const bookList = [];
const RENDER_EVENT = 'renderEvent';
const STORAGE_KEY = 'book_list';
document.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
    window.location.href = 'index.html';
  });
  if (checkStorage()) {
    console.log('berhasil punya storage');
    loadDataFromStorage();
  }
});

function editBook() {
  const inputBookTitle = document.getElementById('inputBookTitle').value;
  const inputBookAuthor = document.getElementById('inputBookAuthor').value;
  const inputBookYear = document.getElementById('inputBookYear').value;
  const checkReaded = get_valueCheckReadedBook();
  const id = generateBookId();
  if (checkReaded === true) {
    const bookObject = generateBookObject(id, inputBookTitle, inputBookAuthor, inputBookYear, true);

    bookList.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    const bookObject = generateBookObject(id, inputBookTitle, inputBookAuthor, inputBookYear, false);

    bookList.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  saveBook();
}

function generateBookId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      bookList.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
function checkStorage() {
  if (typeof Storage === undefined) {
    alert('Browser tidak mendukung local/session storage');
    return false;
  }
  return true;
}
function get_valueCheckReadedBook() {
  const alreadyRead = document.querySelector('#alreadyRead-checkBox');
  if (alreadyRead.checked === true) {
    return true;
  } else {
    return false;
  }
}
function saveBook() {
  if (checkStorage()) {
    const parsedData = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, parsedData);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}
