# React Ref — Complete Notes

---

## Background — How React Owns the DOM

In plain JS, you manage the DOM yourself:

```js
const input = document.querySelector('#name')  // you find the node
input.focus()                                   // you command it
input.addEventListener('click', handler)        // you attach listeners
```

In React, you never do this. You describe what the UI should look like given current state, and React handles all DOM operations internally.

```tsx
// you describe the UI
<input value={name} onChange={e => setName(e.target.value)} />

// React internally does:
// const node = document.createElement('input')
// node.value = name
// node.addEventListener('input', handler)
// document.appendChild(node)
```

React manages every DOM node using refs internally. When you use `useRef`, you are asking React for a handle to one of the nodes it is already managing.

---

## 1. useRef — Grabbing a DOM Node

### The problem

Some things cannot be done through JSX and state alone. They require imperative commands directly on the DOM node:

```tsx
inputRef.current.focus()         // auto-focus an input
inputRef.current.blur()          // remove focus
inputRef.current.select()        // select all text
videoRef.current.play()          // play a video
divRef.current.scrollIntoView()  // scroll to element
```

None of these are possible by changing state. You need the actual node.

### How it works

```tsx
const nameRef = useRef(null)  // create the ref, initially null

<input ref={nameRef} />       // attach it — React sets nameRef.current to the DOM node
```

Now `nameRef.current` is the actual `<input>` DOM node React created.

### Why null initially?

When you write `useRef(null)`, the DOM node does not exist yet — React has not rendered it. After React mounts the component and creates the node, it sets `ref.current` to that node. This is why you access it inside `useEffect`:

```tsx
const nameRef = useRef(null)

useEffect(() => {
  nameRef.current.focus()  // safe here — DOM node exists after mount
}, [])
```

### Timeline

```
useRef(null)          →   ref.current is null
React renders JSX     →   React creates the DOM node
React attaches ref    →   ref.current = the actual DOM node
useEffect runs        →   safe to call ref.current.focus() etc.
```

### DOM properties and methods you get

```tsx
// Properties
ref.current.value        // current value of the input
ref.current.checked      // for checkboxes
ref.current.placeholder
ref.current.type
ref.current.disabled

// Methods
ref.current.focus()      // focus the input
ref.current.blur()       // remove focus
ref.current.click()      // programmatically click
ref.current.select()     // select all text inside
```

---

## 2. useRef as a Value Store

`useRef` has a second job — storing a value that persists across renders without triggering a re-render.

### The difference from useState

```tsx
const [count, setCount] = useState(0)
setCount(5)             // React watches this → triggers re-render → UI updates

const count = useRef(0)
count.current = 5       // React ignores this → no re-render → UI stays the same
```

### When is this useful?

When you need to remember something across renders, but that change should not cause a re-render.

**Tracking render count:**

```tsx
const renderCount = useRef(0)

useEffect(() => {
  renderCount.current += 1  // quietly increments, no re-render triggered
})
```

If you used `useState` here, every increment would trigger a re-render, which would trigger another increment — infinite loop.

**Storing a previous value:**

```tsx
const prevName = useRef('')

useEffect(() => {
  prevName.current = name  // remember the last value quietly
}, [name])
```

### Mental model

Think of `useRef` as a box sitting outside the render cycle. React does not watch it. You can put anything in it, change it anytime — React has no idea and does not care.

```
useState   →   React watches it   →   change = re-render
useRef     →   React ignores it   →   change = nothing
```

---

## 3. forwardRef — Passing a Ref Through a Component

### The problem

`ref` works fine on native DOM elements:

```tsx
const inputRef = useRef(null)
<input ref={inputRef} />   // ✅ ref lands on the DOM node
```

But when the input is wrapped in a component, `ref` gets silently dropped:

```tsx
<TextField ref={inputRef} />  // ❌ ref never reaches the input inside
```

`inputRef.current` stays `null`.

### Why this happens

`ref` is special in React — just like `key`. Neither appears in `props`. React intercepts them before they reach the component.

```tsx
const TextField = (props) => {
  console.log(props)  // { label, error, ...rest } — no ref here
  // ref was pulled out by React, goes nowhere
}
```

### The fix

`forwardRef` lets you receive the ref as a second argument and manually pass it to the DOM node inside:

```tsx
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...rest} />  {/* ref manually passed to DOM node */}
        {error && <p>{error}</p>}
      </div>
    )
  }
)
```

Now `ref` reaches the actual `<input>` inside.

### Why ref is not in ...rest

When React calls a `forwardRef` component, it extracts `ref` and passes it as the second argument. So `rest` never contains `ref` — React already pulled it out.

```tsx
({ label, error, ...rest }, ref) => {
  // ref  → second argument, extracted by React
  // rest → name, onChange, onBlur (no ref inside)
}
```

### How React identifies forwardRef components internally

A normal component is a plain function. A `forwardRef` component is an object:

```ts
{
  $$typeof: Symbol(react.forward_ref),
  render: (props, ref) => { ... }
}
```

React checks `$$typeof` during reconciliation to know whether to call the component as a plain function or as a `render` function with `ref` as the second argument.

---

## 4. forwardRef + React Hook Form

### What register() returns

```tsx
register('name')
// returns: { name, ref, onChange, onBlur }
```

RHF uses that `ref` to attach to the actual DOM node — so it can call `reset()`, apply `defaultValues`, and auto-focus on validation errors.

### On a native input — works fine

```tsx
<input {...register('name')} />
// ref goes directly to the DOM node ✅
// RHF has DOM attachment ✅
```

### On a custom component — ref gets dropped

```tsx
<TextField {...register('name')} />
// ref gets dropped at the component boundary ❌
// RHF has no DOM attachment ❌
// reset(), defaultValues, focus-on-error all silently break ❌
```

### Fix — wrap with forwardRef

```tsx
const TextField = forwardRef<HTMLInputElement, Props>(
  ({ ...rest }, ref) => <input ref={ref} {...rest} />
)

// Now:
<TextField {...register('name')} />
// ref passes through to the input inside ✅
// RHF has DOM attachment ✅
// reset(), defaultValues, focus-on-error all work ✅
```

### Rule

Any time there is a component between `register()` and the actual DOM `<input>`, you need `forwardRef` to bridge them. This includes custom input wrappers, MUI components, and any third-party input component.

---

## Summary

| Concept | What it does | When to use |
|---|---|---|
| `useRef` (DOM) | Holds a handle to a DOM node React created | When you need `.focus()`, `.blur()`, `.select()`, `.play()` etc. |
| `useRef` (value) | Stores a value without triggering re-render | Tracking renders, storing previous values, internal counters |
| `forwardRef` | Passes a ref through a component boundary | Any custom input wrapper used with RHF or that needs a ref from outside |

**One line each:**
- `useRef` — React's way to hand you a node it is already managing
- `useRef` as value store — a box React does not watch
- `forwardRef` — a bridge so ref can cross a component boundary and reach the DOM inside