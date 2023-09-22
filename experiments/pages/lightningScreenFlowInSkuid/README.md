# Integrate Lightning Screen Flows with Skuid 

## Description
This walkthrough explains how to launch a Lightning screen flow from a Skuid page, as well as how to pass parameters into the screen flow if necessary. This allows Skuid builders to utilize already-built Lightning screen flows from their Skuid pages without needing to rebuild existing functionality.



## Setup
To build this, you will need to:
1. Create a new Lightning component (with a controller) from the code provided.
3. Add the newly created custom component to the Lightning page (via Lightning App Builder) that your Skuid page will be on (the custom component acts as a container for the Screen Flow)
4. Configure two Skuid models, one to a Salesforce Object and one UI-Only
6. Add a generic JS snippet to your Skuid page


## Note
It's important to note that in this example the Lightning component is listening for an object to be passed in, (rather than a string), which is why we are using JS to publish an event rather than the declarative "Publish Event" action.  

## Detailed Directions
This step-by-step guide will help you configure everything you need to call a Lightning Screen Flow from your Skuid page:

**Note:**
The **showScreenFlowModal** component picks up the event published by Skuid for that modal based on the event params in the **callFlow.js** snippet.  



### Create the new Lightning component
1. Open the Salesforce Developer Console.
1. Click **File > New > Lightning Component**.
1. Name the component ``showScreenFlowModal``.
1. Click **Submit** to generate the bundle.
1. Paste the code from the [showScreenFlowModal](showScreenFlowModal) file into the component code section.
1.Paste the code from the [showScreenFlowModal_controller](showScreenFlowModal_controller) file into the controller code section.
1. Click **File > Save All**.

### Add the screen flow container to the Lightning page

1. Open Lightning App Builder.
1. Search for ``showScreenFlowModal`` and drag the custom component onto the Lightning page that will contain your Skuid page.

      - It doesn't matter where you place the custom component on the page
   
### Create models for calling screen flows within the Skuid page

1. Open the Composer.
1. Create a new UI-only model named ``FlowParams`` with the following text fields:
     - name
     - type
     - value
        
1. Create a new model named ``Flow`` with the following properties:
   - **Salesforce object name**: FlowInterview
   - **Max # of records (limit)**: 1
1. Add the **Name** field to the model
1. Add a model condition with the following properties:
   - **Field**: Name
   - **Operator**: = (is)
   - **Content**: Single specified value
   - **Value**:  *Leave blank*
   - **State**:  Filterable default on.

### Add JavaScript and Action Framework logic for calling screen flows
1. Create a new JavaScript resource with the following properties:
   - **Resource type**: Generic JS snippet
   - **Snippet name**: callFlow
   - **Snippet body**: *Paste the code from the* [callFlow](callFlow) *file*

Now to create the action sequence that'll use this snippet and take two inputs: one for the flow name and one for the parameter model:

1. Create a new reusable action sequence named “CallFlow”
1. Add a **Run JavaScript snippet** action that runs the **callFlow** snippet
1. Click **Inputs**.
1. Add two inputs:
   - First input:
     - Name: flowName 
     - Type: Value
   - Second input:
     - Name: model 
     - Type: Model
5. Add an action sequence to your Skuid page wherever you want to call the flow (e.g. From a button component, calendar interaction, etc.)

   - Add the following actions
     - Remove all rows in model: FlowParams
     - Create new rows in FlowParams (this is where you define what params you want to pass into the Flow)
       - name = inputStartDateTime (for this example from the screenshot). You need to navigate to the Lightning Screen Flow you want to call and then open the “Screen” element (see screenshot). For any field you want to populate, click on the field and then copy the “Default value” (not including the “{!” or “}”. Go back to your action sequence and Paste that value into your field value (see second screenshot)
      - type = the metadata type for the field you are passing in (e.g. DateTime, String, etc.)
      - value = use merge, field from another model etc.
    - Repeat the above steps for each parameter you need to pass into the flow
    - After you have created rows for each parameter you want to pass into your flow, add a “Run action sequence” 
      - Action sequence: “CallFlow”
      - flowName: Paste the api name of the Lightning flow
      - model: FlowParams

<img width="600" alt="screenshot of inputStartDateTime" src="https://github.com/skuid/skuid-labs/assets/63868385/79a3ea4c-ba6e-4cce-8ec8-54157a9a2957">

<img width="600" alt="Screenshot 2023-09-06 at 11 30 30 AM" src="https://github.com/skuid/skuid-labs/assets/63868385/200333fc-fb75-4145-ada1-76215696cff0">


6. Optional - after your Flow is finished, if you want to run any actions (e.g. re-query a model etc.), you can create an Event-triggered sequence
   - Sequence name: whatever you want
   - Event name: flowModalClosed
   - Listen for events published from: All active pages and Lightning components

