# Integrate Lightning Screen Flows with Skuid 

## Description

This walkthrough explains how to launch a Lightning screen flow from a Skuid page, as well as how to pass variable values into the screen flow if necessary. This allows Skuid builders to utilize already-built Lightning screen flows from their Skuid pages without needing to rebuild existing functionality.

This directory functions as a [Salesforce DX project](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_workspace_setup.htm) for ease of deployment with the Salesforce CLI. 

You'll need these files for *any* flow use case in Skuid:

- `force-app/main/default/aura/showScreenFlowModal/showScreenFlowModal.cmp`
- `force-app/main/default/aura/showScreenFlowModal/controller/showScreenFlowModal_controller.js`

To deploy just these component bundle files, use this command:

```bash
# Use the proper org's alias for the -o flag
sf project deploy start --manifest path/to/package.xml -o <Org alias>
```

Alongside this general use component, this project includes an example flow, Lightning app, Lightning page, and Skuid page to illustrate this functionality.

- `force-app/main/default/flows/testFlow.flow`
- `force-app/main/default/flows/testFlow.flow`

**Note**: that deploying the example Skuid page requires the [skuid-sfdx](https://docs.skuid.com/latest/en/skuid/skuid-sfdx/) plugin.

## Before you begin

This experiment requires specific information about your flow to properly call it from Skuid.

### Find flow API name

Skuid requires the flow's API name to activate it. You can find a flow's API name within the Flow Builder or from the Flows list by clicking **Select Fields to Display** and selecting it there.
### Find flow variable names

Salesforce Flow variables store information that appears in the flow, and this experiment passes in variables values.

To pass variable information to a flow, define the variable as a flow resource. This can be done through the **Toolbox** panel in the Flow Builder. For more information about flow variables, see [Salesforce Trailhead](https://trailhead.salesforce.com/content/learn/modules/flow-basics/learn-about-flow-variables) and [Salesforce documentation](https://help.salesforce.com/s/articleView?id=sf.flow_ref_resources_variable.htm&type=5).

Whether you're creating new variables or using existing ones, **refer to the flow Toolbox for the name and data type of each variable you'll want to update in Skuid**. For example, a variable named ``Reviewer`` may have a data type of ``Text``. 

## Setup

To build this, you will need to:

1. Create a new Lightning component (with a controller) from the code provided.
1. Add the newly created custom component to the Lightning page (via Lightning App Builder) that your Skuid page will be on (the custom component acts as a container for the Screen Flow)
1. Configure two Skuid models, one to a Salesforce Object and one UI-Only
1. Add a generic JS snippet to your Skuid page

   **Note:**
   It's important to note that in this example the Lightning component is listening for an object to be passed in, (rather than a string), which is why we are using JS to publish an event rather than the declarative "Publish Event" action.  

## Detailed Directions

This step-by-step guide will help you configure everything you need to call a Lightning screen flow from your Skuid page:

**Note:**
The **showScreenFlowModal** component picks up the event published by Skuid for that modal based on the event params in the **callFlow.js** snippet.  

### Create the new Lightning component

1. Open the Salesforce Developer Console.
1. Click **File > New > Lightning Component**.
1. Name the component ``showScreenFlowModal``.
1. Click **Submit** to generate the bundle.
1. Paste the code from the [showScreenFlowModal](showScreenFlowModal.cmp) file into the component code section.
1.Paste the code from the [showScreenFlowModal_controller](showScreenFlowModal_controller.js) file into the controller code section.
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

Now to create the action sequence that'll use this snippet and take two inputs: one for the flow name and one for the variables model:

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

Now we'll create button with a set of actions that do the following:
- Empties the model holding our flow variables
- Creates new rows for each variable
- Calls the flow using the `CallFlow` action sequence (which activates the `callFlow` JavaScript snippet)

In this example, we'll use a button that passes in a start date time. For other use cases, remember you must create a new row for *for each variable* you want to pass to the flow.

1. Drag and drop a Button Set component into the canvas.
1. Click **the newly created button**.
1. Click **Actions**  in the Properties pane.
1. Add an action to remove all rows in the variables model:
   - **Action type**: Remove all rows from model
   - **Models to empty**: FlowParams
1. Add a create new row action to pass in variable:
   - **Action type**: Create new rows
   - **Model**: FlowParams
1. Click **More options > Add default value** to add each of these values to that new row:

   - **name**: Enter the variable API name, for example *Reviewer*
   - **type**: Enter the variable data type, for example *DateTime*
   - **value**: Enter the value to use, which can be a merge variable or a hard-coded value 

1. Add an action to run the CallFlow action sequence:
  - **Action sequence**: CallFlow
  - **flowName**: The API name of your flow
  - **model**: FlowParams

<img width="600" alt="screenshot of inputStartDateTime" src="https://github.com/skuid/skuid-labs/assets/63868385/79a3ea4c-ba6e-4cce-8ec8-54157a9a2957">

<img width="600" alt="Screenshot 2023-09-06 at 11 30 30 AM" src="https://github.com/skuid/skuid-labs/assets/63868385/200333fc-fb75-4145-ada1-76215696cff0">


1. (Optional) The Lightning component controller in this experiment publishes a `flowModalClosed` event once the modal is closed. You can use this event as the trigger for an action sequence to run any actions (e.g. re-query a model) that should occur when the model is closed:
   - **Sequence name**: An informative name like *Flow modal closed*
   - **Event name**: flowModalClosed
   - **Listen for events published from**: All active pages and Lightning components

