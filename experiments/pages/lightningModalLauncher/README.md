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
      b. Paste the following code into the “Component” portion:

<aura:component implements="flexipage:availableForAllPageTypes" access="global" >
    <aura:attribute name="showModal" type="Boolean" default="false" access="private" />
    <aura:attribute name="showCancel" type="Boolean" default="true" access="private" />
    <aura:handler event="skuid:event" action="{!c.handleShowModalFlowEvent}" />

 <aura:if isTrue="{!v.showModal}">
     <section tabindex="-1" role="dialog" aria-modal="true" class="slds-modal slds-fade-in-open">
         <div class="slds-modal__container">
             <header class="slds-modal__header">
                 <aura:if isTrue="{!v.showCancel}">
                     <lightning:buttonIcon iconName="utility:close"
                                           onclick="{! c.handleClose }"
                                           alternativeText="close"
                                           variant="bare-inverse"
                                           class="slds-modal__close"/>
                 </aura:if>
             </header>
             <div class="slds-modal__content">
                 <lightning:flow aura:id="flow" onstatuschange="{!c.handleFlowStatusChange}" />
             </div>
             <footer class="slds-modal__footer">
                 <div class="slds-align_absolute-center">
                     <aura:if isTrue="{!v.showCancel}">
                         <lightning:button variant="neutral"
                                           label="Cancel"
                                           title="Cancel"
                                           onclick="{! c.handleClose }"/>
                     </aura:if>
                 </div>
             </footer>
         </div>
     </section>
     <div class="slds-backdrop slds-backdrop_open"></div>
 </aura:if>
</aura:component>
      
   c. Paste the following code into the “Controller” portion:

({
	handleShowModalFlowEvent: function(component, event, helper) {
        let name = event.getParam("name");
        if (name != 'showModalFlow') return;
        let data = event.getParam("data");

        component.set("v.showModal", true);
        let flow = component.find("flow");
        flow.startFlow(data.flowName, data && data.params ? data.params : null);
    },
    handleFlowStatusChange : function(component, event, helper) {
        if (event.getParam('status') === 'FINISHED') {
            var action = component.get("c.refreshPage");
        	$A.enqueueAction(action);
            component.set("v.showModal", false);
        }

    },
    handleClose: function (component, event, helper) {
        component.set("v.showModal", false);
    },
  	refreshPage: function(component, event, helper) {
      	var evt = $A.get("e.skuid:event");
      	evt.setParams({"name": "flowModalClosed"});
      	evt.fire();
  	}
})

2. Open Lightning App Builder
      a. Search for “showScreenFlowModal” and drag the custom component onto your lightning page (doesn’t matter location) where you are going to have your Skuid page that launches the Flow
3. Open Skuid App Composer
      a. Create a new UI-only model named “FlowParams”
            i. Add three UI-only text fields
               1. name
               2. type
               3. value
      b. Create a new model named “Flow” on the FlowInterview object and adjust the model to only return 1 record (default is 20)
            i. Add the “Name” field
            ii. Add a model condition
               1. FlowInterview records where “Name” is Single specified value (leave the value blank). Filterable default on.
      c. Create a new JS snippet (Generic JS snippet) named “callFlow” and paste the following code:

const params = arguments[0],
   eventName = "showModalFlow",
   flowName = params.$Input.flowName,
   model = skuid.$M(params.$Input.model);
console.log(this, skuid, params);


// See if there is a global application event with this name
let auraEvt = window.$A.get("e." + eventName),
   skuidAuraEvt = window.$A.get("e.skuid:event"),
   paramsObject = {
       flowName: flowName,
       params: model.getRows()
   };


// If there is a matching global application event with this name,
// then fire that event, with each Skuid Event parameter
// being mapped directly to that Event parameter.
if (auraEvt) {
   if (paramsObject) {
       auraEvt.setParams(paramsObject);
   }
   auraEvt.fire();
}


skuidAuraEvt.setParams({
   "name": eventName,
   "source": "skuid",
});


// ALSO fire a generic "Skuid Event",
// where all of the parameters are serialized to JSON
if (paramsObject) {
   skuidAuraEvt.setParam("data", paramsObject);
}


skuidAuraEvt.fire();

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

