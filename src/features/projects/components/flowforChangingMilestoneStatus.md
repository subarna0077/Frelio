// we want a behavior where

when user edit the form,

if the user tries to change the status to completed

if user hasnt completed the milestones

open the modal.

CUrrently the react hook form, updates the state directly since we pass the register, it automatically handles the onChange or other similar prop.

It will set the value directly. But our concern is :

We don't want it to happen instantly.

Rather we want is the update confirmation before updating.



// Problem I have encountered

When changing the status