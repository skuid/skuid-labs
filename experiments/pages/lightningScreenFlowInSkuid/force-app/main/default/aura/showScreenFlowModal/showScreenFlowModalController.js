({
	handleShowModalFlowEvent: function(component, event, helper) {
        let name = event.getParam("name");
        if (name != 'showModalFlow') return;
        let data = event.getParam("data");

        component.set("v.showModal", true);
        let flow = component.find("flow");
        flow.startFlow(data.flowName, data && data.params ? data.params : null);
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
