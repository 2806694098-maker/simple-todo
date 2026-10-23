const STORAGE_KEY = "simple-todo-items";
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#task-count");

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(item => item && typeof item.id === "string" && typeof item.text === "string" && typeof item.done === "boolean")
      : [];
  } catch {
    return [];
  }
}

let todos = loadTodos();

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // The list remains usable when browser storage is unavailable.
  }
}

function render() {
  list.replaceChildren();
  for (const todo of todos) {
    const row = document.createElement("li");
    row.className = todo.done ? "done" : "";

    const toggle = document.createElement("button");
    toggle.className = "check";
    toggle.type = "button";
    toggle.textContent = todo.done ? "✓" : "";
    toggle.setAttribute("aria-label", todo.done ? `标记未完成：${todo.text}` : `标记完成：${todo.text}`);
    toggle.addEventListener("click", () => {
      todo.done = !todo.done;
      saveTodos();
      render();
    });

    const label = document.createElement("span");
    label.className = "task-text";
    label.textContent = todo.text;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.type = "button";
    remove.textContent = "删除";
    remove.setAttribute("aria-label", `删除：${todo.text}`);
    remove.addEventListener("click", () => {
      todos = todos.filter(item => item.id !== todo.id);
      saveTodos();
      render();
    });

    row.append(toggle, label, remove);
    list.append(row);
  }
  emptyState.hidden = todos.length > 0;
  count.textContent = `${todos.filter(todo => !todo.done).length} 项未完成`;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.unshift({ id: crypto.randomUUID(), text, done: false });
  input.value = "";
  saveTodos();
  render();
  input.focus();
});

render();
