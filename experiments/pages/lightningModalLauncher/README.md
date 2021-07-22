# Lightning Modal 

## Description:
This page contains a skuid page with a button and a lightning component. The skuid page publishes an event that the lightning component listens for. When the event is published a lightning component is called and it launches a lightning modal where you could put just about anything from lightning.

## Note:
It's important to note if you are trying to modify or access data then you will have to that that the lightning modal takes in an object and not a string so you will have to modify `auraEvt` var in `lightningModalLauncher.xml`  

## Usage:
Connecting the Skuid page to the button is comprised of a few parts: 
* lightningModalLauncher.xml
    * callflow  **Action sequence**
        *  Triggers the callFlow JS snippet 
    *  callFlow  **JS snippet**
        *   Checks to see if the name exists 
        *   Execute the lightning event 
        *   Execute generic Skuid event     
*   Lightning Component Bundles
    *   Contains a generic showScreenFlowModal and showScreenFlowModalController

**Note:  **
You will have to create a custom lightning component to save the **showScreenFlowModal** and **showScreenFlowModalController**.
    
The **showScreenFlowModal** component picks up the event published by skuid for that modal based on the event params in the **callFlow.js** snippet.  