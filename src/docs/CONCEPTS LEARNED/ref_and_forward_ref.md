## What is ref?

Ref in react is a way to point to the dom node of the element. It give direct access to the dom element. The ref stores the value of a html element without triggering the re-renders. (State causes a re-render but ref do not.)

THE DOM elemet has three kinds of things on it.

ref.current.value // current value of the input
ref.current.checked // for checkbox

ref.current.placeholder

ref.current.type

ref.current.disabled // is it disabled


methods:

ref.current.focus() // focuses the input
ref.current.blur() // remove focus

ref.current.click() // programmatically click
ref.current.select() // select all text inside

Event handlers:
ref.current.onblur = ()=>{}
ref.current.onclick = ()=> {}
ref.current.onchange = ()=>{}

# forwardRef

## The Problem

`ref` is special in React — it does not flow through props automatically.

```tsx
// ref on a DOM element — works
<input ref={someRef} />

// ref on a component — gets dropped silently
<TextField ref={someRef} /> // ❌ ref never reaches the input inside
```

When you wrap an input in a component, `ref` gets lost at the component boundary.

## The Fix

`forwardRef` lets you receive the ref as a second argument and manually pass it to the DOM element inside:

```tsx
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...rest} /> {/* ref manually passed here */}
        {error && <p>{error}</p>}
      </div>
    )
  }
)
```

## Why ref is Not in rest

When you spread `{...register('name')}` on a component, React automatically extracts `ref` before it reaches props. So `rest` never contains `ref` — React already pulled it out and passed it as the second argument to `forwardRef`.

```tsx
({ label, error, ...rest }, ref) => {
  // ref → second argument, extracted by React
  // rest → name, onChange, onBlur (no ref)
}
```

## With React Hook Form

`register` returns `{ name, ref, onChange, onBlur }`.

Without `forwardRef` on your custom component — `ref` gets dropped, RHF has no DOM attachment, `reset()` and `defaultValues` won't work visually.

```tsx
// ❌ without forwardRef — ref gets lost
const TextField = ({ ...rest }) => <input {...rest} />

// ✅ with forwardRef — ref reaches the input
const TextField = forwardRef<HTMLInputElement, Props>(
  ({ ...rest }, ref) => <input ref={ref} {...rest} />
)
```

## How React Identifies forwardRef Components

A normal component logs as a plain function. A `forwardRef` component logs as an object:

```ts
{
  $$typeof: Symbol(react.forward_ref),
  render: (props, ref) => { ... }
}
```

React checks `$$typeof` during reconciliation to know how to call the component — plain function vs `render` with ref as second argument.

## Rule

Any time there is a component between `register` and the actual DOM `<input>`, you need `forwardRef` to bridge them. This includes any custom input wrapper, custom dropdown, or third party component.

Direct input — no `forwardRef` needed:
```tsx
<input {...register('name')} /> // ✅ ref goes directly to DOM
```

Wrapped input — `forwardRef` required:
```tsx
<TextField {...register('name')} /> // needs forwardRef inside TextField
```


Declarative vs imperative 

- Imperative (The "How"): You command the browser with precise steps. If a user clicks a button, you must manually fetch the DOM element, create new elements, append text, or toggle CSS classes.

for eg: document.getElementById('name').addEventListener('onChange', (e)=> {
    console.log(e.target.value)
})

we command the browser with precise steps.
- we are commading the browser with exact steps what to do.
1- Find the element.
2- attach the listener
3- do somthing with the value.

In declarative we write ehat we want - 
we want to console the value when clicked.

for eg: 
<input onChange={e=> console.log(e.target.value)}>

// Here react handle the how part internally.
In js, we do each step manually. like select the element, attaching the event listener, and instruct it to print on click

In react we just instruct it to print on click, the other thing like selection of the element, attaching the listener is done by react internal.


What happen when we do :
<input onChange={(e)=> console.log(e.target.value)}/>

When we do this in react.
React internally does.

const input = document.createElement('input')
input.addEventListener('change', (e)=> {
    console.log(e.target.value)
})

document.appendChild(input)
input.removeEventListener('change'),; // on unmount clean up


But the react dont actually attach the listeners to individual elements - React uses the concept of event delegation.

// React attaches one listener at the root:

document.addEventListener('change', handler)
// Suppose if there are 4-5 listeners in a app, the how is it handled?

When any input changes, the event bubbles up to root.

React checks which component it came from and calls the right event handler.


// why is it necessary to cleanup when unmounting??

- In plain js, there is no concept of unmounting.
once we add a listener, it stays there forever unless you manually remove it.


Why is the concept of unmounting was necessary in react but not in plain js? 

- It is because in plain js, we think in terms of elements. We create the element, add the listeners, remove the element when done. 


In react, we think in terms of components. We dont manually create or remove DOM elements. React does that for u. We just write what the UI should look like and react figure when to create and destroy element.

Because React is controlling the DOM for you, it needs to tell you, hey this component is being removed from the DOM. so you can clean up anything u started. That is called unmounting.

IN react, we build the dynamic UIs. COmponent come and go constantly. 
We open a modal - modal component mounts.
close a modal - modal component unmountsl
navigate to another page - current page unmount.

React is constantly creating and destroying DOM elements based on state. React calls document.removeChild() and remove from the DOM.

But any listeners we attach manually via useEffect - React does'nt know about those. It only removes the DOM element - not your listeners. So the listener is pointiing your removed element and stiting in memory.

Thats why cleanup is necessary in react.

My question - cant supabase be handled directly by react. what can react handle the listeners as its own?

React can only own things that go through JSX. React job is to manage the DOM through JSX. Anything beyond of the DOM is not React's responsibility.

Supabase is a external service. React has no way it exists. 

Things React owns and cleans up automatically:
<input onChange={...} />       // DOM event listener
<button onClick={...} />       // DOM event listener
<div onMouseEnter={...} />    

That's it. Only JSX event props on DOM elements.
Everything else is outside React's world:

tsx // all of these — you own, you clean up

supabase.auth.onAuthStateChange(...)  // external library
window.addEventListener(...)          // browser API
document.addEventListener(...)        // browser API
setTimeout(...)                       // browser API
setInterval(...)                      // browser API
websocket.onmessage = ...    


What is listener vs the function?

supabase.auth.onAuthStateChange is a function.
The listener is a callback you pass to it.

Difference between the regular function vs a listener.

Regular function - we call it, it runs , it is done.

const add = (a,b)=> a+b;
add(1,2) // runs once , done , gone

Listener - we hand it to someone else, it sits waiting, get called multiple times

for eg: 
(event, session) => {
      if (event === 'SIGNED_OUT' || !session) logout();
      if (event === 'SIGNED_IN') setUser({
        id: session!.user.id,
        name: session!.user.user_metadata.full_name,
        email: session!.user.email!
      });
      if (event === 'TOKEN_REFRESHED') setUser({
        id: session!.user.id,
        name: session!.user.user_metadata.full_name,
        email: session!.user.email!
      })
    }

this function is a listener - we hand it to someone else, it sits waiting, get called multiple times.

// handed to supabase.
// sits in supabase array
// gets called every time when auth change
// keeps living until unsubscribed.

Similarly
window.addEventListener('resize', () => console.log('resized'))

addEventListener is just the function, the callback is the listener

// SO what is the difference between Listener and callback

Both are the same thing. a callback becomes a listener on how it is used.

In general, callback is a function we pass into another function.





