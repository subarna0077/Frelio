# Declarative vs Imperative

---

## The core difference

**Imperative** — you describe *how* to do something. You give the browser exact step by step commands.

**Declarative** — you describe *what* you want. Someone else figures out the how.

---

## Imperative — plain JS

```js
document.getElementById('name').addEventListener('input', (e) => {
  console.log(e.target.value)
})
```

You are giving exact steps:
1. Find the element
2. Attach a listener to it
3. Do something with the value

You are the one deciding how each step happens.

---

## Declarative — React

```tsx
<input onChange={e => console.log(e.target.value)} />
```

You are just saying what you want — *log the value when it changes*. React figures out the how internally:
- creating the DOM node
- attaching the listener
- cleaning up on unmount

You never write those steps yourself.

---

## Why HTML alone is not enough

Plain HTML is also declarative — you describe structure, the browser renders it. But it is **static**. The moment data changes, you need JS to manually update the DOM:

```js
// data changed — now YOU must update the DOM
document.querySelector('.status').textContent = newStatus
document.querySelector('.total').textContent = newTotal
```

You are back to imperative — manually syncing every change.

---

## What React actually solves

React is declarative *and* keeps the UI in sync with data automatically.

```tsx
<Chip label={status.toUpperCase()} />
```

When `status` changes, React re-runs this, diffs the old and new output, and updates the DOM. You never touch the DOM.

---

## One sentence each

- **Imperative** — you tell the browser exactly what to do and how to do it, step by step
- **Declarative** — you describe what the end result should look like, and let the system figure out how
- **React's value** — declarative UI that stays automatically in sync with changing data

---

## The only question that matters

> When data changes — who updates the DOM?

- Plain JS → you do, manually, imperatively
- React → React does, automatically, based on your JSX

That is the entire difference.