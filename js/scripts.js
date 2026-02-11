// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#editForm");
const editInput = document.querySelector("#editInput");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterSelect = document.querySelector("#filter-select");

let oldInputValue = "";


// Funções
const saveTodo = (text, done = false, save = true) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  todoList.appendChild(todo);

  if (save) {
    saveTodoLocalStorage({ text, done });
  }

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (newText) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const title = todo.querySelector("h3");

    if (title.innerText === oldInputValue) {
      title.innerText = newText;
      updateTodoLocalStorage(oldInputValue, newText);
    }
  });
};

// Local Storage
const getTodosLocalStorage = () => {
  return JSON.parse(localStorage.getItem("todos")) || [];
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (text) => {
  let todos = getTodosLocalStorage();

  todos = todos.filter((todo) => todo.text !== text);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const toggleStatusLocalStorage = (text) => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.text === text) {
      todo.done = !todo.done;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (oldText, newText) => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.text === oldText) {
      todo.text = newText;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

// Busca
const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const title = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = title.includes(search.toLowerCase())
      ? "flex"
      : "none";
  });
};

// Filtro
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    switch (filterValue) {
      case "all":
        todo.style.display = "flex";
        break;

      case "done":
        todo.style.display = todo.classList.contains("done")
          ? "flex"
          : "none";
        break;

      case "todo":
        todo.style.display = !todo.classList.contains("done")
          ? "flex"
          : "none";
        break;
    }
  });
};


// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value.trim();

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest(".todo");

  if (!parentEl) return;

  const titleEl = parentEl.querySelector("h3");
  const todoTitle = titleEl.innerText;

  // Finalizar
  if (targetEl.closest(".finish-todo")) {
    parentEl.classList.toggle("done");
    toggleStatusLocalStorage(todoTitle);
  }

  // Remover
  if (targetEl.closest(".remove-todo")) {
    parentEl.remove();
    removeTodoLocalStorage(todoTitle);
  }

  // Editar
  if (targetEl.closest(".edit-todo")) {
    oldInputValue = todoTitle;
    editInput.value = oldInputValue;
    toggleForms();
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value.trim();

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  getSearchTodos(e.target.value);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  getSearchTodos("");
});

filterSelect.addEventListener("change", (e) => {
  filterTodos(e.target.value);
});


// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, false);
  });
});
