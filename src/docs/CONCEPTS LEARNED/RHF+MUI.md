# RHF + MUI Select — Complete Notes

---

## 1. What RHF is trying to do

When you build a form, you need to track:
- Current value of each field
- Whether the user has touched it
- Whether it is valid

RHF handles all of this for you. But it needs a way to **know when the value changes**.

---

## 2. How `register` works on a plain `<input>`

```tsx
const { register } = useForm()

<input {...register("username")} />
```

`register` returns:

```tsx
{
  name: "username",
  ref: fn,       // attaches to the real DOM input
  onChange: fn,  // RHF's own function — stores value in RHF store
  onBlur: fn     // marks field as touched
}
```

What do onChange of the register look like?

``` tsx
onChange = (e) => {
  // 1. read the value from the event
  const value = e.target.value

  // 2. store it in RHF's internal ref store
  formValues.current['username'] = value

  // 3. run validation if mode is set to onChange
  triggerValidation('username')

  // 4. notify any watchers
  // if you have form.watch('username') somewhere
  // it will get the new value and re-render
  notifyWatchers('username')
}

```

RHF's `onChange` is not React's onChange. It is just a **regular JavaScript function RHF wrote** that gets passed as the `onChange` prop. React detects the event and calls whatever function is in that prop — it does not care whose function it is.

The **DOM is the source of truth** with `register`. RHF reads `ref.current.value` to get the current value.

---

## 3. The `ref` in `register`

The ref attached by `register` is used for:
- **Reading the value** — `ref.current.value`
- **Focus management** — `ref.current.focus()` when validation fails
- **Knowing if the field is mounted**

---

## 4. Does RHF's `onChange` override your `onChange`?

Yes — if you spread `register` after your own `onChange`:

```tsx
// ❌ your onChange gets overridden — spread order matters
<input
  onChange={(e) => console.log("my handler")}
  {...register("username")}
/>

// ✅ merge manually
const { onChange, ...rest } = register("username")

<input
  {...rest}
  onChange={(e) => {
    console.log("my handler")
    onChange(e)  // call RHF's handler too
  }}
/>
```

Or use the `register` options:

```tsx
<input
  {...register("username", {
    onChange: (e) => console.log("my handler")
  })}
/>
```

---

## 5. Why `register` breaks with MUI Select

MUI Select is not a plain input. It is built entirely out of divs:

```html
<div role="combobox">        <!-- visible trigger -->
<div role="listbox">         <!-- dropdown -->
  <li role="option">One</li> <!-- MenuItems -->
</div>
<input type="hidden" aria-hidden="true" />  <!-- hidden input -->
```

The browser does not understand this as a real select. When the user clicks a MenuItem, the browser only fires a **click event** — not a change event. MUI catches that click and manually constructs a fake event object:

```tsx
// MUI does this internally
onChange({
  target: {
    value: selectedValue
  }
})
```

This is why MUI Select onChange looks the same as a plain input — MUI is faking the event shape for consistency.

### What breaks with `register` on MUI Select

| Problem | Why |
|---|---|
| `ref` lands on hidden input | `aria-hidden` input is nested deep — `ref.current.focus()` focuses invisible element |
| Default value breaks | RHF sets `ref.current.value = defaultValue` but MUI controls its own internal state and overwrites it |
| `setValue` doesn't update UI | RHF updates the DOM node but MUI doesn't know — it only watches its own internal React state |

**Root cause:** `register` assumes it fully owns a real DOM input. MUI Select owns its own internal React state. They fight over who owns the value — and RHF loses.

---

## 6. What `Controller` does differently

`Controller` bypasses the DOM entirely and communicates with MUI through **React props**.

```tsx
<Controller
  name="province_id"
  control={form.control}
  render={({ field }) => (
    <TextField select {...field}>
      <MenuItem value={1}>Kathmandu</MenuItem>
    </TextField>
  )}
/>
```

Internally, `Controller` constructs a `field` object and passes it to your render function:

```tsx
// roughly what Controller does inside
const field = {
  name: "province_id",
  value: 3,           // from RHF internal store — NOT from DOM
  onChange: (val) => {
    store.set(name, val)  // writes to RHF store
    triggerRerender()
  },
  onBlur: () => store.setTouched(name),
  ref: fn             // only for focus management
}
```

Spreading `{...field}` onto TextField is the same as:

```tsx
<TextField
  select
  name={field.name}
  value={field.value}
  onChange={field.onChange}
  onBlur={field.onBlur}
/>
```

MUI receives `value` as a prop and renders correctly. When user picks an option, MUI calls `field.onChange` — RHF stores the new value. No DOM involved.

---

## 7. The RHF internal store

RHF stores form state using `useRef` internally — not `useState`. Roughly:

```tsx
const formValues = useRef({
  province_id: 3,
  username: "john"
})
```

`useRef` is used to avoid unnecessary re-renders. `getValues()` and `watch()` read from this object.

- With `register` — DOM is source of truth, store is secondary
- With `Controller` — RHF store is the only source of truth, DOM is never read

---

## 8. `field` vs `register` — structural difference

| Property | `register` | `field` (Controller) |
|---|---|---|
| `name` | ✅ | ✅ |
| `ref` | ✅ reads value + focus | ✅ focus only |
| `onChange` | ✅ reads `e.target.value` | ✅ accepts raw value or event |
| `onBlur` | ✅ | ✅ |
| `value` | ❌ reads from DOM | ✅ from RHF store |

---

## 9. Re-render comparison

| Approach | What re-renders |
|---|---|
| `register` | No re-renders — DOM holds value |
| `Controller` | Only that specific Controller component |
| `watch` in parent | Entire parent component |

`Controller` subscribes to only its own field internally. When value changes, only that Controller re-renders — the parent component is untouched.

`watch` in the parent registers the subscription at the parent level — so the entire parent re-renders.

---

## 10. When to use `register` vs `Controller`

```
MUI TextField (text)  → register  ✅ real native input
MUI Checkbox          → register  ✅ real native input underneath
MUI Select            → Controller ✅ hidden nested input, no real DOM events
```

Use `Controller` only when the component does not expose a real DOM input that RHF can attach to.

---

## 11. Number values in MUI Select

MUI Select always gives `e.target.value` as a **string** even if your MenuItem value is a number. With `Controller` you can handle this two ways:

```tsx
// Option 1 — override onChange to convert
<TextField
  select
  {...field}
  onChange={(e) => field.onChange(Number(e.target.value))}
>

// Option 2 — pass number directly as MenuItem value
// MUI passes it through field.onChange as-is (no DOM reading involved)
<MenuItem value={p.id}>  // p.id is already a number
```

Option 2 works with `Controller` because it never reads from the DOM. With `register`, the DOM always converts to string.

---

## 12. Correct `Controller` pattern for MUI Select

```tsx
<Controller
  name="office_address.province_id"
  control={form.control}
  render={({ field }) => (
    <TextField
      select
      label="Province"
      {...field}
      error={!!form.formState.errors.office_address?.province_id}
      helperText={form.formState.errors.office_address?.province_id?.message}
      sx={{ flex: 1 }}
    >
      {provinces?.map((p) => (
        <MenuItem key={p.id} value={p.id}>
          {p.name}
        </MenuItem>
      ))}
    </TextField>
  )}
/>
```

Key points:
- Self-closing `/>` — no children on Controller
- `{...field}` spread before error props so error props don't get overridden
- `key` on every MenuItem
- Error and helperText wired from `form.formState.errors`

---

## 13. `watch` — its actual purpose

`watch` is for **reading a value to use in your JSX logic** — not for controlling an input.

```tsx
const billingIsDifferent = form.watch('billing_is_different')

// use it for conditional rendering
{billingIsDifferent && <BillingAddressSection />}
```

Do not pass `watch` value back into the same input as `value` — that is redundant if `register` or `Controller` already owns it.

---