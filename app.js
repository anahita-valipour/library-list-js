const bookName = document.querySelector("#book-name");
const addBook = document.querySelector("#add-book");
const message = document.querySelector("#message");
const bookCount = document.querySelector("#book-count");
const booklist = document.querySelector("#book-list");
const searchBook = document.querySelector("#search-book");
const favorite = document.querySelector(".favorite");
const favoriteCount = document.querySelector("#favorite-count");
const favoriteHeart = document.querySelector(".favorite-heart");
const favoritesPanel = document.querySelector("#favorites-panel");
const favoriteBookList = document.querySelector("#favorite-book-list");
const undoBtn = document.querySelector("#undo-btn");
const readBtn = document.querySelector("#read-btn");

let isValied = true;
let count = 0;
let editTittle = null;
let countFav = 0;
let books = [];
let deletedBooks = [];
let onlyRead = false;
// title ,isRead,id

//

addBook.addEventListener("click", () => {
  if (bookName.value.trim()) {
    if (editTittle !== null) {
      editBook();
    } else {
      creatBook();
    }
  } else if (bookName.value.trim() === "") {
    isValied = false;
    message.textContent = "نام کتاب را به لیست اضافه کنید ";
  }
});

booklist.addEventListener("click", (e) => {
  let liItem = e.target.closest("li");

  if (e.target.classList.contains("delet")) {
    const id = Number(liItem.dataset.id);

    const undoBook = books.find((book) => book.id === id);

    deletedBooks.push(undoBook);
    books = books.filter((book) => book.id !== id);

    liItem.remove();
    bookName.value = "";
    
    showheart();
    if (editTittle && editTittle.closest("li") === liItem) {
  editTittle = null;
  addBook.textContent = "افزودن کتاب";
}
    countFav = books.filter((book) => book.isFavorite).length;
    favoriteCount.textContent = countFav;
    bookCount.textContent = books.length;
  }
});

readBtn.addEventListener("click", () => {
    const query = searchBook.value.trim().toLowerCase();
  let machedBook = books.filter((book) =>
    book.title.toLowerCase().includes(query),
  );
  onlyRead = !onlyRead;
  if (onlyRead) {
    machedBook = machedBook.filter((book) => book.isRead === true);
    arrayBook = [...booklist.children];
    arrayBook.forEach((li) => {
      const id = Number(li.dataset.id);
      const maches = machedBook.some((book) => book.id === id);
      li.hidden = !maches;
    });
  } else {
    arrayBook = [...booklist.children];
    arrayBook.forEach((li) => {
      const id = Number(li.dataset.id);
      const maches = books.some((book) => book.id === id);
      li.hidden = !maches;
    });
  }
});

undoBtn.addEventListener("click", () => {
  if (deletedBooks.length === 0) return;

  const undoBook = deletedBooks.pop();

  books.push(undoBook);
  creatBook(undoBook);

  bookCount.textContent = books.length;
  showheart();
  countFavourite();
});

booklist.addEventListener("click", (e) => {
  let liItem = e.target.closest("li");
  let spanItem = liItem.querySelector(".title-book");

  if (e.target.classList.contains("edit")) {
    editTittle = spanItem;

    bookName.value = spanItem.textContent;

    addBook.textContent = "ویرایش کتاب";
  }
});

function editBook() {
  let liItem = editTittle.closest("li");
  let newTitle = bookName.value.trim();
  const id = Number(liItem.dataset.id);
  const book = books.find((book) => book.id === id);
  book.title = newTitle;
  editTittle.textContent = newTitle;
  liItem.dataset.tittle = newTitle;

  bookName.value = "";
  addBook.textContent = "افزودن کتاب";
  editTittle = null;
}

function creatBook(existingBook = null) {
  let book;

  if (existingBook) {
    book = existingBook;
  } else {
    book = {
      title: bookName.value.trim(),
      isRead: false,
      id: Date.now(),
      isFavorite: false,
    };

    books.push(book);
  }

  const li = document.createElement("li");
  const span = document.createElement("span");

  span.classList.add("title-book");
  li.dataset.tittle = book.title;
  li.dataset.id = book.id;
  span.textContent = book.title;

  li.appendChild(span);
  booklist.appendChild(li);

  const readtBtn = document.createElement("button");
  readtBtn.textContent = book.isRead ? "خواندم" : "نخواندم";
  li.appendChild(readtBtn);

  if (book.isRead) {
    span.classList.add("read");
  }

  readtBtn.addEventListener("click", () => {
    book.isRead = !book.isRead;

    if (span.classList.toggle("read")) {
      readtBtn.textContent = "خواندم";
    } else {
      readtBtn.textContent = "نخواندم";
    }
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "ویرایش";
  editBtn.classList.add("edit");
  li.appendChild(editBtn);

  const deletBtn = document.createElement("button");
  deletBtn.textContent = "حذف";
  deletBtn.classList.add("delet");
  li.appendChild(deletBtn);

  const favoriteBtn = document.createElement("button");
  favoriteBtn.textContent = "♥";
  li.appendChild(favoriteBtn);

  if (book.isFavorite) {
    favoriteBtn.classList.add("favorite");
    favoriteBtn.style.color = "red";
  }

  favoriteBtn.addEventListener("click", () => {
    book.isFavorite = !book.isFavorite;

    if (book.isFavorite) {
      favoriteBtn.classList.add("favorite");
      favoriteBtn.style.color = "red";
      message.textContent = "کتاب به لیست علاقه‌مندی اضافه شد";
    } else {
      favoriteBtn.classList.remove("favorite");
      favoriteBtn.style.color = "";
      message.textContent = "کتاب از علاقه‌مندی‌ها حذف شد";
    }

    showheart();

    countFavourite();
  });

  if (!existingBook) {
    message.textContent = "کتاب به لیست اضافه شد";
  }

  bookCount.textContent = books.length;

  if (!existingBook) {
    setTimeout(() => {
      bookName.value = "";
      message.textContent = "";
    }, 1000);
  }
}

favoriteHeart.addEventListener("click", () => {
  favoritesPanel.hidden = !favoritesPanel.hidden;
});
function showheart() {
  const filterBook = books.filter((book) => book.isFavorite === true);
  favoriteBookList.textContent = "";
  filterBook.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = book.title;
    favoriteBookList.appendChild(li);
  });
}
function countFavourite() {
  countFav = books.filter((book) => book.isFavorite).length;
  favoriteCount.textContent = countFav;
}
function applySearch() {
  const query = searchBook.value.trim().toLowerCase();
  let machedBook = books.filter((book) =>
    book.title.toLowerCase().includes(query),
  );

  if (onlyRead) {

    machedBook = machedBook.filter((book) => book.isRead === true);
  }
  let arrayBook = [...booklist.children];

  arrayBook.forEach((li) => {
    const id = Number(li.dataset.id);
    const maches = machedBook.some((book) => book.id === id);

    li.hidden = !maches;
  });
}
searchBook.addEventListener("input", applySearch);
