({
	handleShowModalFlowEvent: function(component, event, helper) {
        let eventName = event.getParam("name");
		// Verify that the event is for showing the modal
        if (eventName != 'showModalFlow') return;
        // Get our flow name and variable values
        let data = event.getParam("data");
		let flowName = data.flowName;
        let variables = data.variables;
        component.set("v.showModal", true);		
		// With our modal now showing, we can access and start the flow
        let flow = component.find("flow");
        flow.startFlow(flowName,variables);
    },
    handleFlowStatusChange: function(component, event, helper) {
        if (event.getParam('status') === 'FINISHED') {
            var action = component.get("c.closeModal");
            $A.enqueueAction(action);
        }
    },
    handleClose: function (component, event, helper) {
		var action = component.get("c.cancelModal");        
        $A.enqueueAction(action);
    },
    closeModal: function(component, event, helper) {
        // Fire an event that can be listened to by Skuid for post-modal actions
        component.set("v.showModal", false);
        var evt = $A.get("e.skuid:event");
        evt.setParams({"name": "flowModalClosed"});
        evt.fire();
    },	
    cancelModal: function(component, event, helper) {
        // Fire an event that can be listened to by Skuid for post-modal actions
        component.set("v.showModal", false);
        var evt = $A.get("e.skuid:event");
        evt.setParams({"name": "flowModalCancelled"});
        evt.fire();
    },	
 })
