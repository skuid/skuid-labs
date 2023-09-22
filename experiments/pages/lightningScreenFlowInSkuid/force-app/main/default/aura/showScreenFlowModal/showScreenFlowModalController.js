({
	handleShowModalFlowEvent: function(component, event, helper) {
        let eventName = event.getParam("name");
		// Check that we've got a request to show a modal
		// If not, return. Otherwise, start setting our variables.
        if (eventName != 'showModalFlow') return;
        let data = event.getParam("data");
		let flowName = data.flowName;
        let variables = data.variables;
        //let variables = [{name:"Name",type:"String",value:"HI"},{name:"OtherVariable",type:"Number",value:5}];
        component.set("v.showModal", true);		
		// With our modal now showing, we can access the flow
        let flow = component.find("flow");
            flow.startFlow(flowName,variables);
    },
    handleFlowStatusChange: function(component, event, helper) {
        if (event.getParam('status') === 'FINISHED') {
            var action = component.get("c.refreshPage");
            $A.enqueueAction(action);
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