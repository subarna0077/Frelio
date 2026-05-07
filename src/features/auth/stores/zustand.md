
// Rehydration is the process of reading persisted data from the localstorage and putting it back to the in memory store when the app loads. the term comes from the idea that the store was dried out **serialized into a string** and now is being **rehydrated** back into a live javascript object.


What happens behind the scene?
1. App loads - zustand creates the store with the defaults

``` ts
// store is initialized with these values
{
    isAuthenticated: false,
    user: null,
    token: '
}

```

At first , persist is called, persist receives initializer set() function and the options object

``` ts
const enhanced = persist(
    (set)=> ({
        isAuthenticated: false,
        user: null,
        token: '
    })
)

// enhanced is just a function nothing is called yet

```

- create calls the enhanced initializer

create() passes (set, get, api) into the enhanced function. Now things actually start running
