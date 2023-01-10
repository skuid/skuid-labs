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