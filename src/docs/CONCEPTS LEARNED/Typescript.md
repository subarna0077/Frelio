# TypeScript Utility Types

---

## What is a Utility Type?

TypeScript utility types are built-in helpers that TypeScript ships with. They are pre-written generic types that solve common patterns — so we don't have to write them ourselves.

Think of them like functions — but for types instead of values. They take a type as input and return a new type.

---

## `Partial`

Makes every property of a type optional.

```tsx
type User = {
  name: string
  address: string
}

type PartialUser = Partial<User>
// becomes:
// {
//   name?: string
//   address?: string
// }
```

### My confusion — can we apply Partial during definition?

```tsx
// ❌ this does not work
type User: Partial = {
  name: string
}
```

No. Utility types are not applied during definition. We apply them after defining the base type by creating a new type from it:

```tsx
// ✅ define first
type User = {
  name: string
  address: string
}

// then apply
type PartialUser = Partial<User>
```

If we want to do it inline we can pass the object type directly:

```tsx
// ✅ inline
type PartialUser = Partial<{
  name: string
  address: string
}>
```

---

## `Required`

Exact opposite of `Partial`. Makes every property required — removes all `?`.

```tsx
type User = {
  name?: string
  address?: string
}

type RequiredUser = Required<User>
// becomes:
// {
//   name: string
//   address: string
// }
```

---

## `Pick`

Takes an existing type and picks only the properties we specify.

```tsx
type User = {
  name: string
  address: string
  phone: string
}

type UserInfo = Pick<User, 'name' | 'address'>
// becomes:
// {
//   name: string
//   address: string
// }
```

Creates a new type with only the fields we listed.

---

## `Omit`

Exact opposite of `Pick`. Takes an existing type and removes the properties we specify.

```tsx
type User = {
  name: string
  address: string
  phone: string
}

type UserWithoutPhone = Omit<User, 'phone'>
// becomes:
// {
//   name: string
//   address: string
// }
```

### Pick vs Omit — when to use which

If you have 10 properties and want 9 — use `Omit` (remove 1).
If you have 10 properties and want 2 — use `Pick` (pick 2).

---

## `Record`

Defines the shape of an object in terms of what its keys and values are.

```tsx
Record<KeyType, ValueType>
```

- `KeyType` — what type the keys are
- `ValueType` — what type the values are

```tsx
Record<string, number>
// { 'name': 1, 'address': 2 }

Record<string, string[]>
// { 'fruits': ['apple', 'banana'] }
```

---

## `Path<ClientFormType>` — RHF Utility Type

`Path` is RHF's own utility type — same concept as TypeScript utility types but ships with RHF. It takes our form type and generates a union of every valid field path as a string.

```tsx
// if ClientFormType is:
{
  name: string
  email: string
  office_address: {
    city: string
    province_id: number
  }
}

// Path<ClientFormType> becomes:
"name" | "email" | "office_address" | "office_address.city" | "office_address.province_id"
```

Every possible dot-notation path we can use with `register`, `watch`, `trigger` etc.

### How we used it

```tsx
const VALIDATION_STEP_FIELDS: Record<number, Path<ClientFormType>[]> = {
  0: ['client_type'],
  1: ['name', 'billing_name', 'email', 'phone', 'pan_number'],
}
```

- Keys are `number` — because steps are 0, 1, 2
- Values are `Path<ClientFormType>[]` — arrays of valid field paths
- TypeScript catches typos because it knows exactly what paths are valid

---