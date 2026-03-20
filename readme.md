# My Tasks — To-Do List App

**Live demo → [todo-app-per.vercel.app](https://todo-app-per.vercel.app)**

A minimal, dark-themed to-do list web app built with pure vanilla HTML, CSS, and JavaScript. No frameworks, no bundlers, no dependencies — just three files.

---

## Features

- **Add tasks** — type and hit Enter or click the `+` button
- **Complete tasks** — click the circular checkbox to animate a task into the completed section
- **Expand long tasks** — click any task text to toggle full word-wrap, click again to collapse
- **Clear completed** — one-click button to remove all done tasks
- **Live progress bar** — fills as tasks are completed, resets as they are cleared
- **Today's date** — displayed in the header on load
- **Persistent storage** — tasks saved to `localStorage`, survive page refresh
- **Responsive layout** — adapts cleanly to mobile and desktop
- **Custom SVG favicon** — inline data URI, no extra file needed

---

## Tech Stack

| Layer | Detail |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 — custom properties, flexbox, `@keyframes` animations |
| Logic | Vanilla JS — ES6 classes, event delegation, `localStorage`, `DocumentFragment` |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| Hosting | Vercel (static site) |
| Analytics | Vercel Web Analytics |
| Performance | Vercel Speed Insights |

---

## Project Structure

```
├── index.html     # App shell, markup, favicon, and script tags
├── todo.css       # All styles and CSS design tokens
├── todo.js        # App logic — Task class, render, persistence
└── README.md
```

---

## Getting Started

No install or build step required:

```bash
# Clone the repo
git clone https://github.com/git-rubayedFoysal/todo-app.git
cd todo-app

# Open directly in browser
open index.html

# Or serve locally
npx serve .
```

---

## How It Works

**State** is held in a plain `allTask` array of `Task` class instances. Every UI change — add, complete, clear — mutates this array, calls `saveTodos()` to persist to `localStorage`, then calls `renderTask()` to rebuild the DOM. There is one single render path; no dual DOM update branches.

**Persistence** uses `localStorage.setItem` directly so other keys in storage are never accidentally wiped. On page load, saved plain objects are reconstructed into proper `Task` instances so class methods work correctly on loaded data.

**Expanded state** (which tasks have their text unwrapped) is tracked in an in-memory `Set` of task IDs. It survives re-renders — `buildLi()` checks the Set and re-applies `.expanded` — but resets on page reload since it is a transient UI preference, not persistent data.

**Event delegation** is used on both list containers rather than attaching listeners to individual `<li>` elements, keeping memory usage flat regardless of task count.

**Animations** — tasks slide in on add and fade-scale out on completion before the re-render fires.

---

## Deployment

Deployed on Vercel as a static site connected to GitHub. Every push to the main branch triggers a new deployment automatically.

Vercel Web Analytics and Speed Insights are loaded via plain HTML script tags and activate only on Vercel — they are completely silent when running locally.

---

## Author

Built by **Rubayed Foysal** — [github.com/git-rubayedFoysal](https://github.com/git-rubayedFoysal)

---

## License

MIT