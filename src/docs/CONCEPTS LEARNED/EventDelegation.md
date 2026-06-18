# Event delegation

---

## What it is

Event delegation means attaching one listener at the top instead of attaching individual listeners to every element.

React uses this for every event in your app. No matter how many `onClick`, `onChange`, or `onSubmit` handlers you write in JSX — React attaches only one listener per event type at the root of the app.

---

## Plain JS — listener on every element

In plain JS, you attach a listener directly to each element:

```js
cardDiv.addEventListener('click', handler)
selectEl.addEventListener('change', handler)
buttonEl.addEventListener('click', handler)
```

3 elements = 3 listeners in memory. 10 elements = 10 listeners. Each one needs to be manually removed when the element is gone.

---

## React — one listener at the root

React does not attach listeners to individual DOM nodes. Instead:

```js
// React does this once, at the root, for the entire app
document.addEventListener('click', reactHandler)
document.addEventListener('change', reactHandler)
```

One listener handles every click in the entire app. One listener handles every change. The JSX event props you write (`onClick`, `onChange`) are not real DOM listeners — they are handlers stored in the fiber tree, waiting to be looked up.

---

## Real example — AddClientModal

In the modal, you have three separate event handlers:

```tsx
// client type card
<Box onClick={() => form.setValue('client_type', type.value)} />

// province select (billing address)
<TextField
  onChange={(e) => form.setValue('billing_address.province_id', Number(e.target.value))}
/>

// submit button
<Button onClick={() => console.log('errors', form.formState.errors)} />
```

None of these have a listener attached to their actual DOM node. React does not do:

```js
cardDiv.addEventListener('click', ...)      // ❌ React does not do this
selectEl.addEventListener('change', ...)    // ❌ React does not do this
buttonEl.addEventListener('click', ...)     // ❌ React does not do this
```

All three handlers are stored in the fiber tree. React has one listener at the root waiting for events to bubble up.

---

## How it works — step by step

**1. User clicks the "Business" type card.**

The click fires on that `Box` div. The browser automatically bubbles it upward through every parent — Form → Dialog → root div.

**2. React intercepts at the root.**

React's single click listener fires at the root. It reads `event.target` to find which DOM node was actually clicked.

**3. React walks the fiber tree.**

Starting from that DOM node, React walks up the fiber tree looking for a matching `onClick` handler.

**4. React calls the right handler.**

It finds the fiber node for the "Business" card, sees `onClick: () => form.setValue('client_type', 'business')`, and calls it.

The same process happens for every event in the modal — province change, district change, checkbox, submit button. All handled by one root listener.

---

## Why React does this

- **Performance** — one listener is cheaper than hundreds. Large apps with many interactive elements don't accumulate hundreds of DOM listeners.
- **Automatic cleanup** — when a component unmounts (like when the modal closes), React removes the fiber nodes. Since handlers were never attached to DOM nodes directly, there's nothing to clean up on the DOM side.
- **Consistency** — React controls all events from one place, which lets it implement features like synthetic events, batching state updates, and consistent event behavior across browsers.

---

## Key distinction

```tsx
// This is NOT a DOM listener
<Box onClick={() => form.setValue('client_type', type.value)} />

// This IS storing a handler in the fiber tree
// React looks it up only when a click bubbles to the root
```

The `onClick` prop in JSX is an instruction to React — "store this handler in the fiber for this node." It is not `addEventListener` in disguise.

---

## Summary

| | Plain JS | React |
|---|---|---|
| Where listeners live | On each DOM element | One at the root |
| How many listeners | One per interactive element | One per event type, total |
| How handler is found | Directly on the element | React walks fiber tree from event.target |
| Cleanup on remove | Manual removeEventListener | Automatic — handlers were never on DOM |