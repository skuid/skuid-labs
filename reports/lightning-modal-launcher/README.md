# Launch Dynamic Lightning Modal from Skuid

Have you ever wanted to call a Lightning Screen Flow or some other cool custom component in a Skuid Page?

Below we will cover what it looks like to build a dynamic Lightning modal (that accepts parameters) that can be launched from Skuid. This modal can contain pretty much any Lightning component, that fits in a Lightning modal, although its most commonly been used to contain Lightning Screen Flows.

The fundamental approach is this:

 1. Create a custom Lightning component that contains the event listeners, modal, etc.
 1. Create a Skuid page,as instructed in this report, that contains the necessary models, action sequences, and javascript to communicate with the lightning component.
 1. Add both the custom Lightning component and the Skuid page to a Lightning Page in the Lightning App Builder.


## How to use this

1. 
