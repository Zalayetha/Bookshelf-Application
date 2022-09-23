const form = document.getElementById('form-bookshelf');
const bookList = [];
const RENDER_EVENT = 'renderEvent';
const STORAGE_KEY = 'book_list';
document.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });
  document.addEventListener(RENDER_EVENT, () => {
    const unreadBook = document.getElementById('unread-book');
    unreadBook.innerHTML = '';
    const alreadyReadBook = document.getElementById('readed-book');
    alreadyReadBook.innerHTML = '';
    for (const book of bookList) {
      const container = makeBookShelf(book);
      if (book.isComplete === true) {
        alreadyReadBook.append(container);
      } else {
        unreadBook.append(container);
      }
    }
  });
  if (checkStorage()) {
    console.log('berhasil punya storage');
    loadDataFromStorage();
  }
});

function addBook() {
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
function makeBookShelf(book) {
  const textContainer = document.createElement('div');
  textContainer.classList.add('textContainer');
  const titleText = document.createElement('h3');
  titleText.innerText = book.title;
  const authorText = document.createElement('h4');
  authorText.innerText = 'By  ' + ' ' + book.author;
  const yearText = document.createElement('p');
  yearText.innerText = 'Year : ' + book.year;

  // delete button
  const deleteButton = document.createElement('button');
  textContainer.setAttribute('id', `book-${book.id}`);
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => {
    deleteBook(book.id);
  });

  // edit button
  const editButton = document.createElement('button');
  editButton.classList.add('edit-button');
  editButton.addEventListener('click', () => {
    window.location.href = 'editbook.html';
  });
  if (!book.isComplete) {
    const checkRead = document.createElement('button');
    checkRead.classList.add('check-button');
    checkRead.addEventListener('click', () => {
      addBookToAlreadyRead(book.id);
    });
    textContainer.append(titleText, authorText, yearText, checkRead, deleteButton, editButton);
  } else {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', () => {
      undoBook(book.id);
    });

    textContainer.append(titleText, authorText, yearText, undoButton, deleteButton, editButton);
  }
  return textContainer;
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
function addBookToAlreadyRead(id) {
  const book = findBook(id);

  if (book === null) {
    return;
  }
  book.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
function deleteBook(id) {
  const indexBook = findIndexBook(id);

  if (indexBook === null) {
    return;
  }
  bookList.splice(indexBook, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
function findBook(id) {
  for (const book of bookList) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}
function findIndexBook(id) {
  for (const index in bookList) {
    if (bookList[index].id === id) {
      return index;
    }
  }
  return null;
}
function undoBook(id) {
  const book = findBook(id);

  if (book === null) {
    return;
  }
  book.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
function saveBook() {
  if (checkStorage()) {
    const parsedData = JSON.stringify(bookList);
    localStorage.setItem(STORAGE_KEY, parsedData);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
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
