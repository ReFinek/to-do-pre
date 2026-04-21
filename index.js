// Исходный массив задач по умолчанию
let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

// DOM-элементы
const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

// Ключ для localStorage
const STORAGE_KEY = "todoTasks";

// Функция загрузки задач из localStorage или возврата массива по умолчанию
function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  if (savedTasks) {
    return JSON.parse(savedTasks);
  }
  return items;
}

// Функция создания элемента задачи с обработчиками
function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(
    ".to-do__item-button_type_duplicate"
  );
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  // Устанавливаем текст задачи
  textElement.textContent = item;

  // Обработчик удаления
  deleteButton.addEventListener("click", () => {
    clone.remove(); // удаляем элемент из DOM
    const updatedTasks = getTasksFromDOM();
    saveTasks(updatedTasks);
  });

  // Обработчик копирования
  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem); // добавляем копию в начало списка
    const updatedTasks = getTasksFromDOM();
    saveTasks(updatedTasks);
  });

  // Обработчик редактирования
  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    // Если текст стал пустым, можно оставить как есть или удалить задачу – по желанию
    // Следуя заданию, просто сохраняем изменения
    const updatedTasks = getTasksFromDOM();
    saveTasks(updatedTasks);
  });

  return clone;
}

// Функция получения списка задач из DOM (массив строк)
function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  const tasks = [];
  itemsNamesElements.forEach((element) => {
    tasks.push(element.textContent);
  });
  return tasks;
}

// Функция сохранения задач в localStorage
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// --- Загрузка и отображение задач при старте ---
items = loadTasks(); // переопределяем глобальный массив задачами из хранилища или дефолтными
items.forEach((task) => {
  listElement.append(createItem(task));
});

// --- Обработчик отправки формы (добавление новой задачи) ---
formElement.addEventListener("submit", (event) => {
  event.preventDefault(); // отключаем перезагрузку страницы

  const newTaskText = inputElement.value.trim();
  if (newTaskText === "") {
    return; // не добавляем пустые задачи
  }

  const newTaskElement = createItem(newTaskText);
  listElement.prepend(newTaskElement); // добавляем в начало списка

  inputElement.value = ""; // очищаем поле ввода

  const updatedTasks = getTasksFromDOM();
  saveTasks(updatedTasks);
});
