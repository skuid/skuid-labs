# Integrate Lightning Screen Flows with Skuid 

## Description

This walkthrough explains how to launch a Lightning screen flow from a Skuid page, as well as how to pass variable values into the screen flow if necessary. This allows Skuid builders to utilize already-built Lightning screen flows from their Skuid pages without needing to rebuild existing functionality.

## Before you begin

This experiment requires specific information about the flow to properly call it from Skuid.

### Find flow API name

Skuid requires the flow's API name to activate it. You can find a flow's API name within the Flow Builder or from the Flows list by clicking **Select Fields to Display** and selecting it there.
### Find flow variable names

Salesforce flow variables store information that appears in the flow, and this experiment passes in variables values.

To pass variable information to a flow, define the variable as a flow resource. This can be done through the **Toolbox** panel in the Flow Builder. For more information about flow variables, see [Salesforce Trailhead](https://trailhead.salesforce.com/content/learn/modules/flow-basics/learn-about-flow-variables) and [Salesforce documentation](https://help.salesforce.com/s/articleView?id=sf.flow_ref_resources_variable.htm&type=5).

Whether you're creating new variables or using existing ones, **refer to the flow Toolbox for the name and data type of each variable you'll want to update in Skuid**. For example, a variable named ``Name`` may have a data type of ``String``. 

Refer to [Salesforce documentation](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.use_flow_data_types) to verify the proper API name of each data type, but here's a cheatsheet:

| API Name (To use as the "type" value) | Label in Salesforce   |
|---------------------------------------|-----------------------|
| Apex                                  | Apex-defined          |
| Boolean                               | Boolean               |
| Currency                              | Integer               |
| Date                                  | Date                  |
| DateTime                              | Date/Time             |
| Number                                | Number                |
| Multipicklist                         | Multi-Select Picklist |
| Picklist                              | String                |
| sObject                               | Record                |
| String                                | Text                  |

## Deploy with `sf` CLI

This directory functions as a [Salesforce DX project](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_workspace_setup.htm) for ease of deployment with the Salesforce CLI. 

You'll need these files for *any* flow use case using the paradigm documented below in Skuid:

- **Component code**: `force-app/main/default/aura/showScreenFlowModal/showScreenFlowModal.cmp`
- **Component controller code**: `force-app/main/default/aura/showScreenFlowModal/showScreenFlowModalController.js`

To deploy just these component bundle files, use this command:

```bash
# Assumes you are running the command from this directory
# Use the proper org alias for the -o flag
# Tested with @salesforce/cli/2.10.2
sf project deploy start --manifest package.xml -o <Org alias>
```

Alongside this general use component, this project includes an example flow, Lightning page, and Skuid page to illustrate this functionality.

- **Example flow:**`force-app/main/default/flows/testFlow.flow-meta.xml`
- **Example Lightning page:**`force-app/main/default/flexipages/ScreenFlowTest.flexipage`
- **Example Skuid page:** `force-app/main/default/skuid/pages/ScreenFlow.xml` and `force-app/main/default/skuid/pages/ScreenFlow.json`

To deploy the component bundle *and* these example files, use these commands:

**Note**: Deploying the example Skuid page requires the [skuid-sfdx](https://docs.skuid.com/latest/en/skuid/skuid-sfdx/) plugin.

```bash
# Assumes you are running these commands from this directory
# Use the proper org alias for the -o flag
# Use your username for the skuid:page:push command
# Tested with @salesforce/cli/2.10.2 and skuid-sfdx 0.4.0
sf skuid:page:push --dir skuid/pages --targetusername <Your username>
sf project deploy start --manifest example-package.xml -o <Org alias>
```

Then, to see the provided demo Lightning page: 

1. Navigate to the **Lightning App Builder**
1. Edit the newly added `ScreenFlowTest` Lightning page
1. Click **Save**.
1. Click **Activation** and activate the page.

**You must save and activate the page** before the deployed changes can appear.

## Deploy manually 

### Create the Lightning component

First, create a new Lightning component (with a controller) from the code provided that functions as a container for the screen flow)

1. Open the Salesforce Developer Console.
1. Click **File > New > Lightning Component**.
1. Name the component ``showScreenFlowModal``.
1. Click **Submit** to generate the bundle.
1. Paste the code from the [showScreenFlowModal.cmp](force-app/main/default/aura/showScreenFlowModal/showScreenFlowModal.cmp) file into the component code section.
1. Paste the code from the [showScreenFlowModal_controller.js](force-app/main/default/aura/showScreenFlowModal/showScreenFlowModalController.js) file into the controller code section.
1. Click **File > Save All**.

### Create the Skuid page

Next, create a new Skuid page and configure it as follows:

1. Configure a UI-only model to store flow variable values
1. Add a generic JS snippet to your Skuid page to process variable values from the Skuid model and publish an Aura event calling the screen flow
1. Add (and call) an action sequence that creates model row values and calls the snippet

   **Note**: This example's Lightning component is listening for an object to be passed in rather than a string, which is why we are using JavaScript to publish an event rather than the declarative Publish event action.  

#### Create a model for variable values

Create a new UI-only model named ``FlowVariables`` with the following text fields:

- name
- type
- value

#### Add JavaScript and Action Framework logic for calling screen flows

Create a new JavaScript resource with the following properties:
   - **Resource type**: Generic JS snippet
   - **Snippet name**: callFlow
   - **Snippet body**: *Paste the code from the* [callFlow](callFlow) *file*

Now to create the action sequence that'll use this snippet and take two inputs: one for the flow name and one for the variables model:

1. Create a new reusable action sequence named **CallFlow**.
1. Add a **Run JavaScript snippet** action that runs the **callFlow** snippet.
1. Click **Inputs**.
1. Add two inputs:
   - First input:
     - Name: flowName 
     - Type: Value
   - Second input:
     - Name: model 
     - Type: Model

Now create an action trigger that does the following:

- Empties the rows from the flow variables model
- Create a new row for *for each variable* you want to pass to the flow.
- Calls the flow using the `CallFlow` action sequence (which activates the `callFlow` JavaScript snippet)

To recreate Button Set in the provided example Skuid page:

1. Drag and drop a Button Set component into the canvas.
1. Click **the newly created button**.
1. Click **Actions**  in the Properties pane.
1. Add an action to remove all rows in the variables model:
   - **Action type**: Remove all rows from model
   - **Models to empty**: FlowVariables
1. Add a create new row action to pass in variable:
   - **Action type**: Create new rows
   - **Model**: FlowVariables
1. Click **More options > Add default value** to create this set of default values:
   - Row 1:
     - **name**: text
     - **type**: String
     - **value**: a string of text
   - Row 2:
     - **name**: dateTime
     - **type**: DateTime
     - **Field value source**: Result of a formula
     - **Formula**: NOW()

   **Note**: If you'll be using merge variables to provide date/time values, use formulas as a value source. Date/time merge variables won't work in this setup.

1. Add an action to run the **CallFlow** action sequence:
   - **Action sequence**: CallFlow
   - **flowName**: The API name of the flow
   - **model**: FlowVariables
1. (Optional) The Lightning component controller in this experiment publishes a `flowModalClosed` event once the modal is closed. You can use this event as the trigger for an action sequence to run any actions that should occur when the modal is closed (e.g. re-query a model):
   - **Sequence name**: An informative name like *Flow modal closed*
   - **Event name**: flowModalClosed
   - **Listen for events published from**: All active pages and Lightning components

### Add the screen flow container and Skuid page to the Lightning page

Finally, add the custom component and Skuid page to a Lightning page via Lightning App Builder.

In Salesforce Setup:

1. Navigate to **Lightning App Builder**.
1. Create a new Lightning page.
1. Search for ``showScreenFlowModal`` and drag the custom component onto the Lightning page that will contain your Skuid page.

      - It doesn't matter where you place the custom component on the page.
1. Add a **Skuid Page** component targeting the Skuid page 
   
## Troubleshooting

### When I click my flow button nothing happens

This can occur if the `showScreenFlowModal` component is not included within the Lightning page/Experience site. Be sure it is also present in the builder's canvas.

## Ideas for improvement

It'd be interesting to utilize the Metadata Tooling API to query for [flow metadata](https://developer.salesforce.com/docs/atlas.en-us.246.0.api_meta.meta/api_meta/meta_visual_workflow.htm)—and retrieve a list of acceptable variables. This could be used to improve the variable-setting experience in the Composer.
