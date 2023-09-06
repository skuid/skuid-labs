# Integrate Lightning Screen Flows with Skuid 

## Description:
This walkthrough explains how to launch a Lightning Screen Flow from a Skuid page as well as pass parameters into the Screen Flow if necessary. This allows Skuid builders to utilize already-built Lightning Screen Flows from their Skuid pages wihtout needing to rebuild existing functionality.



## Setup:
To build this, you will need to:
1. Create a new Lightning component (with a Controller) from the code provided.
3. Add the newly created custom component to the Lightning page (via Lightning App Builder) that your Skuid page will be on (the custom component acts as a container for the Screen Flow)
4. Configure two Skuid models, one to a Salesforce Object and one UI-Only
6. Add a generic JS snippet to your Skuid page


## Note:
It's important to note that in this example the Lightning component is listening for an object to be passed in, (rather than a string), which is why we are using JS to publish an event rather than the declarative "Publish Event" action.  

## Detailed Directions:
This step-by-step guide will help you configure everything you need to call a Lightning Screen Flow from your Skuid page:

**Note:**
The **showScreenFlowModal** component picks up the event published by Skuid for that modal based on the event params in the **callFlow.js** snippet.  



1. Open the Salesforce Developer Console
      a. Click File/New/Lightning Component
            i. Name the component “showScreenFlowModal”
      b. Paste the code from the “[showScreenFlowModal]([url](https://github.com/skuid/skuid-labs/blob/improve_screenflow/experiments/pages/lightningModalLauncher/showScreenFlowModal))” file
      c. Paste the code from the "[showScreenFlowModal_controller]([url](https://github.com/skuid/skuid-labs/blob/improve_screenflow/experiments/pages/lightningModalLauncher/showScreenFlowModal_controller))" file into the “Controller” portion

2. Open Lightning App Builder
      a. Search for “showScreenFlowModal” and drag the custom component onto your lightning page (doesn’t matter location) where you are going to have your Skuid page that launches the Flow
   
4. Open Skuid App Composer
      a. Create a new UI-only model named “FlowParams”
            i. Add three UI-only text fields
               1. name
               2. type
               3. value
      b. Create a new model named “Flow” on the FlowInterview object and adjust the model to only return 1 record (default is 20)
            i. Add the “Name” field
            ii. Add a model condition
               1. FlowInterview records where “Name” is Single specified value (leave the value blank). Filterable default on.
      c. Create a new JS snippet (Generic JS snippet) named “callFlow” and paste the code from the [callFlow]([url](https://github.com/skuid/skuid-labs/blob/improve_screenflow/experiments/pages/lightningModalLauncher/callFlow)) file

4. Create a new Reusable Action Sequence named “CallFlow”
      a. Add a “Run JavaScript snippet” action and run the snippet “callFlow”
      b. Add two inputs
            i. Name: flowName Type: Value
            ii. Name: model Type: Model
5. Add an action sequence to your Skuid page wherever you want to call the flow (e.g. From a button component, calendar interaction, etc.)
      a. Add the following actions
            i. Remove all rows in model: FlowParams
            ii. Create new rows in FlowParams (this is where you define what params you want to pass into the Flow)
                  1. name = inputStartDateTime (for this example from the screenshot). You need to navigate to the Lightning Screen Flow you want to call and then open the “Screen” element (see screenshot). For any field you want to populate, click on the field and then copy the “Default value” (not including the “{!” or “}”. Go back to your action sequence and Paste that value into your field value (see second screenshot)
<img width="1219" alt="screenshot of inputStartDateTime" src="https://github.com/skuid/skuid-labs/assets/63868385/79a3ea4c-ba6e-4cce-8ec8-54157a9a2957">

<img width="1063" alt="Screenshot 2023-09-06 at 11 30 30 AM" src="https://github.com/skuid/skuid-labs/assets/63868385/200333fc-fb75-4145-ada1-76215696cff0">

                  2. type = the metadata type for the field you are passing in (e.g. DateTime, String, etc.)
                  3. value = use merge, field from another model etc.
            iii. Repeat the above steps for each parameter you need to pass into the flow
            iv. After you have created rows for each parameter you want to pass into your flow, add a “Run action sequence”
                  1. Action sequence: “CallFlow”
                  2. flowName: Past the api name of the Lightning flow
                  3. model: FlowParams
6. Optional - after your Flow is finished, if you want to run any actions (e.g. re-query a model etc.), you can create an Event-triggered sequence
      a. Sequence name: whatever you want
      b. Event name: flowModalClosed
      c. Listen for events published from: All active pages and Lightning components

