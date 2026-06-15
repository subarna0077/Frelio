Controlled input
If the input value is managed by the react, then it is called controlled input.


If the input value is managed or own by the dom, then it is called the uncontrolled. Using ref is uncontrolled.


<input /> - This is uncontrolled.

<input value = {val} onChange = {e=> setVal(e.target.value)}/> - This is conotrolled.


In MUI
<TextField /> - This is uncontrolled.

<TextField value={val} onChange={()=> setVal(...)}> - This is controlled.


When I pass the value prop, then forget to pass the onChange prop , then the MUI warns it. Why?

Because with value prop, the ownership comes to me, I should manage this myself. MUI is telling. You are now the owner of that field, manage data yourself.


In plain js
We take the dom node directly like querySelector. The DOM is the source of truth. We manipulate it directly.

Then react came.
React now manages the UI. But inputs are special. They have their own internal state. So react had to make a choice.

- Do you want React's state to own the value ? - Controlled.

- Do you want the DOM to own like the old JS days? - Uncontrolled Ref


ref is uncontrolled why? 

Because ref = useRef<HTMLINPUTELEMENT>
<input ref={ref}/>

It means that ref.current.value means document.querySelector().value 

ref.current is the actual DOM element. When using Ref, we are bypassing the React completely and talking to the DOM directly. exactly like plain JS.

React doesnt care about what value is there.


<TextField inputRef={ref} />




