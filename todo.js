const ulPending = document.querySelector("#pendingLists");
const ulComplete = document.querySelector("#completeLists");
const form = document.querySelector("form");
const countIn = document.querySelector("#countIn");
const countCo = document.querySelector("#countCo");
const clearBtn = document.querySelector("#btn");
const progressBar = document.querySelector("#progressBar");
const emptyPending = document.querySelector("#emptyPending");
const emptyComplete = document.querySelector("#emptyComplete");
const dateChip = document.querySelector("#dateChip");

// ── Date chip ────────────────────────────────────────────────────────────────
dateChip.textContent = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// ── Task class ───────────────────────────────────────────────────────────────
class Task {
  constructor(text, id = Date.now(), isComplete = false) {
    this.id = id;
    this.text = text;
    this.isComplete = isComplete;
  }

  markComplete(status) {
    this.isComplete = status;
  }
}

// ── State ────────────────────────────────────────────────────────────────────
const allTask = [];
const expandedIds = new Set(); // tracks which task IDs have their text expanded

// ── Persistence ──────────────────────────────────────────────────────────────
function loadTask() {
  const saved = localStorage.getItem("todos");
  if (!saved) return;
  const parsed = JSON.parse(saved);
  if (!Array.isArray(parsed) || parsed.length === 0) return;
  // Reconstruct proper Task instances so class methods work on loaded data
  parsed.forEach((t) => allTask.push(new Task(t.text, t.id, t.isComplete)));
}

function saveTodos() {
  // Use setItem directly — avoid localStorage.clear() which wipes all keys
  localStorage.setItem("todos", JSON.stringify(allTask));
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function updateProgress() {
  const total = allTask.length;
  const done = allTask.filter((t) => t.isComplete).length;
  progressBar.style.width =
    total === 0 ? "0%" : `${Math.round((done / total) * 100)}%`;
}

// ── Render ───────────────────────────────────────────────────────────────────
function renderTask() {
  let c_in = 0;
  let c_co = 0;

  // replaceChildren() is safer than innerHTML = ""
  ulPending.replaceChildren();
  ulComplete.replaceChildren();

  const fragPending = document.createDocumentFragment();
  const fragDone = document.createDocumentFragment();

  // forEach for side effects, not map()
  allTask.forEach((t) => {
    const li = buildLi(t);
    if (!t.isComplete) {
      fragPending.append(li);
      c_in++;
    } else {
      fragDone.append(li);
      c_co++;
    }
  });

  countIn.textContent = c_in;
  countCo.textContent = c_co;
  ulPending.append(fragPending);
  ulComplete.append(fragDone);

  emptyPending.style.display = c_in === 0 ? "block" : "none";
  emptyComplete.style.display = c_co === 0 ? "block" : "none";

  updateProgress();
}

// ── Build a single <li> ───────────────────────────────────────────────────────
function buildLi(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;

  if (!task.isComplete) {
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.name = "complete";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    if (expandedIds.has(task.id)) span.classList.add("expanded");
    span.addEventListener("click", () => {
      const isExpanded = span.classList.toggle("expanded");
      expandedIds[isExpanded ? "add" : "delete"](task.id);
    });

    li.append(cb, span);
  } else {
    const icon = document.createElement("span");
    icon.className = "done-icon";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;
    if (expandedIds.has(task.id)) span.classList.add("expanded");
    span.addEventListener("click", () => {
      const isExpanded = span.classList.toggle("expanded");
      expandedIds[isExpanded ? "add" : "delete"](task.id);
    });

    li.append(icon, span);
  }

  return li;
}

// ── Load on startup ───────────────────────────────────────────────────────────
window.addEventListener("load", () => {
  loadTask();
  renderTask();
});

// ── Add task ──────────────────────────────────────────────────────────────────
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#text");
  const text = input.value.trim();
  if (!text) return;

  allTask.push(new Task(text));
  saveTodos();
  // Single render path — no dual DOM updates
  renderTask();
  form.reset();
});

// ── Mark complete (event delegation on pending list) ──────────────────────────
ulPending.addEventListener("change", (e) => {
  if (!e.target.matches('input[type="checkbox"]')) return;

  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  // forEach for side effects, strict === comparison
  allTask.forEach((t) => {
    if (t.id === id) t.markComplete(true);
  });

  saveTodos();

  // Animate out, then re-render
  li.classList.add("removing");
  li.addEventListener("animationend", () => renderTask(), { once: true });
});

// ── Clear completed ───────────────────────────────────────────────────────────
clearBtn.addEventListener("click", () => {
  const incomplete = allTask.filter((t) => !t.isComplete);
  allTask.length = 0;
  incomplete.forEach((t) => allTask.push(t));
  saveTodos();
  renderTask();
});
