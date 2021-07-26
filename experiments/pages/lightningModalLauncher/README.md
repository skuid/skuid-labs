# Lightning Modal 

## Description:
This page contains a Skuid page with a button and a Lightning component. The Skuid page publishes an event that the Lightning component listens for. When the event is published a Lightning component is called and it launches a Lightning modal where you could put just about anything from Lightning.

## Setup:
To build this, you will need to:
1. Create a new Skuid page and import the lightningModalLauncher.xml into it. 
2. create a Lightning component(For this example you can call it: showScreenFlowModal) and import both showScreenFlowModal and showScreenFlowModalController as seperate files 
3. Create a new Lightning app Page and add 
   3a. The Skuid page onto your Lightning page view  
   3b. The showScreenFlowModal    


## Note:
It's important to note that in this example the Lightning component is listening for an object to be passed in, (rather than a string), which is why we are using JS to publish an event rather than the declarative "Publish Event" action. If you need to modify the parameters being passed into the modal/flow it will need to be modified in the Javascript and the Lightning component.   

## Usage:
Connecting the Skuid page to the button is comprised of a few parts: 
* LightningModalLauncher.xml
    * callflow  **Action sequence**
        *  Triggers the callFlow JS snippet 
    *  callFlow  **JS snippet**
        *   Checks to see if the name exists 
        *   Execute the Lightning event 
        *   Execute generic Skuid event     
*   Lightning Component Bundles
    *   Contains a generic showScreenFlowModal and showScreenFlowModalController

**Note:  **
You will have to create a custom Lightning component to save the **showScreenFlowModal** and **showScreenFlowModalController**.
    
The **showScreenFlowModal** component picks up the event published by Skuid for that modal based on the event params in the **callFlow.js** snippet.  