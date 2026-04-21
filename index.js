let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

const STORAGE_KEY = "todo-list";

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return items;
}

function createItem(itemText) {
  const template = document.getElementById("to-do__item-template");
  const clone = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = itemText;

  // Удаление
  deleteButton.addEventListener("click", () => {
    clone.remove();
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  // Дублирование
  duplicateButton.addEventListener("click", () => {
    const currentText = textElement.textContent;
    const duplicatedItem = createItem(currentText);
    listElement.prepend(duplicatedItem);
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  // Редактирование
  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
  });

  return clone;
}

function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  const tasks = [];
  itemsNamesElements.forEach((element) => {
    tasks.push(element.textContent);
  });
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Обработчик отправки формы
formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const newTaskText = inputElement.value.trim();
  if (newTaskText === "") return;

  const newItemElement = createItem(newTaskText);
  listElement.prepend(newItemElement);
  inputElement.value = "";

  const currentTasks = getTasksFromDOM();
  saveTasks(currentTasks);
});

// Начальная отрисовка
items = loadTasks();
items.forEach((taskText) => {
  const itemElement = createItem(taskText);
  listElement.append(itemElement);
});
