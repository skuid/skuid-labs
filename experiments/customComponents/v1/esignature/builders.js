(function(skuid) {

	var bc = skuid.builder.core;
	var componentId = "esignature__signature";

	bc.registerBuilder(new bc.Builder({
		id: componentId,
		name: "E-Signature",
		icon: "sk-icon-edit",
		description: "Allows a user to enter an electronic signature, and stores the signature to a field in a Skuid Model.",
		componentRenderer: function(component) {
			component.setTitle(component.builder.name);
		},
		propertiesRenderer: function (propViewer, component) {
			propViewer.setTitle("E-Signature Component Properties");
			var state = component.state;
			var propCategories = [];
			var propsList = [
				{
					id: "model",
					type: "model",
					label: "Model",
					onChange: function(){
						if (state.attr("field")) {
							component.state.removeAttr("field");
							component.save().rebuildProps(propViewer);
						}
					},
				},
				{
					id: "field",
					type: "field",
					modelprop: "model",
					label: "Signature data field",
					helptext: "A text field on the Model where signature data should be stored",
					displayTypeFilter: [
						"TEXT",
						"TEXTAREA",
						"STRING",
					],
				},
				bc.coreProps.uniqueIdProp({
					component: component
				}),
			];
			propCategories.push({
				name: "",
				props: propsList,
			});
			propViewer.applyPropsWithCategories(propCategories, state);
		},
		defaultStateGenerator : function() {
			return skuid.utils.makeXMLDoc("<" + componentId + "/>");
		},
		actions: [
			{
				value: "clearData",
				label: "Clear Signature Data",
			},
			{
				value: "saveToField",
				label: "Save Signature Data to Model Field",
			},
		],
	}));

})(skuid);