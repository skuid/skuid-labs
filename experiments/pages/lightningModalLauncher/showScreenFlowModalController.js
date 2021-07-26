({
	handleShowModalFlowEvent: function(component, event, helper) {
        let name = event.getParam("name");
        if (name != 'showModalFlow') return;
        let data = event.getParam("data");
        component.set("v.showModal", true);
    },
    handleClose: function (component, event, helper) {
        component.set("v.showModal", false);
    }
})