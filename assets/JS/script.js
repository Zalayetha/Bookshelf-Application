const form = document.getElementById('form-bookshelf');
const bookList = [];
const RENDER_EVENT = 'renderEvent';
const STORAGE_KEY = 'book_list';
const SAVE_EVENT = 'saveEvent';
const bookUnread = document.getElementById('searchBookUnread');
const bookRead = document.getElementById('searchBookRead');
document.addEventListener('DOMContentLoaded', () => {
  form.addEventListener('submit', (e) => {
    addBook();
    document.dispatchEvent(new Event(SAVE_EVENT));
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
  document.addEventListener(SAVE_EVENT, () => {
    alert('Berhasil Menambahkan Data ');
  });
  if (checkStorage()) {
    loadDataFromStorage();
  }
  bookUnread.addEventListener('keyup', () => {
    searchBookUnread();
  });
  bookRead.addEventListener('keyup', () => {
    searchBookRead();
  });
});

function addBook() {
  let idBook;
  const inputIdBook = document.getElementById('inputIdBook').value;
  const inputBookTitle = document.getElementById('inputBookTitle').value;
  const inputBookAuthor = document.getElementById('inputBookAuthor').value;
  const inputBookYear = document.getElementById('inputBookYear').value;
  const checkReaded = get_valueCheckReadedBook();
  if (inputIdBook === '') {
    idBook = generateBookId();
  } else {
    idBook = Number(inputIdBook);
  }
  if (checkReaded === true) {
    const bookObject = generateBookObject(idBook, inputBookTitle, inputBookAuthor, inputBookYear, true);

    bookList.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
  } else {
    const bookObject = generateBookObject(idBook, inputBookTitle, inputBookAuthor, inputBookYear, false);

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
  titleText.setAttribute('class', 'titleBook');
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
    editBook(book.id);
  });
  if (!book.isComplete) {
    textContainer.classList.add('unreadBook');
    const checkRead = document.createElement('button');
    checkRead.classList.add('check-button');
    checkRead.addEventListener('click', () => {
      addBookToAlreadyRead(book.id);
    });
    textContainer.append(titleText, authorText, yearText, checkRead, deleteButton, editButton);
  } else {
    textContainer.classList.add('readBook');
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
  const alreadyRead = document.getElementById('alreadyRead-checkBox');
  console.log(alreadyRead);
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
function editBook(id) {
  try {
    const bookIndex = findIndexBook(id);
    const { id: idBook, title, author, year, isComplete } = bookList[bookIndex];
    if (bookIndex === null) {
      return;
    }
    if (bookList[bookIndex].id === id) {
      if (isComplete === true) {
        document.getElementById('alreadyRead-checkBox').checked = true;
      } else {
        document.getElementById('alreadyRead-checkBox').checked = false;
      }
    }

    inputIdBook.value = idBook;
    inputBookTitle.value = title;
    inputBookAuthor.value = author;
    inputBookYear.value = year;
    bookList.splice(bookIndex, 1);
    console.log(bookList);
    form.scrollIntoView({
      behavior: 'smooth',
    });
  } catch (error) {
    alert('Error');
  }
}

function searchBookUnread() {
  let filter = bookUnread.value.toUpperCase();
  let bookTitle = document.querySelectorAll('.unreadBook');
  for (i = 0; i < bookTitle.length; i++) {
    let book = bookTitle[i];
    let txtValue = book.textContent || book.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      bookTitle[i].style.display = '';
      console.log(txtValue.toUpperCase().indexOf(filter));
    } else {
      bookTitle[i].style.display = 'none';
    }
  }
}

function searchBookRead() {
  let filter = bookRead.value.toUpperCase();
  let bookTitle = document.querySelectorAll('.readBook');
  for (i = 0; i < bookTitle.length; i++) {
    let book = bookTitle[i];
    let txtValue = book.textContent || book.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      bookTitle[i].style.display = '';
      console.log(txtValue.toUpperCase().indexOf(filter));
    } else {
      bookTitle[i].style.display = 'none';
      console.log(txtValue.toUpperCase().indexOf(filter));
    }
  }
}
