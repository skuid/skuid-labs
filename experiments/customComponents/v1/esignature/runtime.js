(function(skuid) {

	var $ = skuid.$;

	skuid.componentType.register("esignature__signature", {
		render: function(element, xmlDef, component) {

			var model = skuid.$M(xmlDef.attr("model"));

			if (!model) {
				element.html("<h4>A valid Model must be provided for this signature component.</h4>");
				return;
			}
			var dataFieldId = xmlDef.attr("field");
			var dataFieldObject = model.getField(dataFieldId);
			var textFieldTypes = [
				"TEXT",
				"TEXTAREA",
				"STRING",
			];
			if (!dataFieldObject || ($.inArray(dataFieldObject.displaytype, textFieldTypes) < 0)) {
				element.html("<h4>A valid text field must be provided for this signature component to store data in.</h4>");
				return;
			}
			var row = model.getFirstRow();

			component.set({
				model: model,
				row: row,
				dataFieldId: dataFieldId,
			});

			var parentPage = component.getParentPage();
			if (parentPage && parentPage.get("rendered")) {
				initialRender();
			} else {
				skuid.$(".nx-page").one("pageload", initialRender);
			}

			function initialRender() {
				// init signature canvas
				element.jSignature();
				element.jSignature("reset");

				// $(".nx-page").one("pageload", function() {
				// Create new signature in text field
				var sigData = model.getFieldValue(row, dataFieldId, true);
				// read existing Signature data and prepopulate.
				if (sigData !== null ) {
					element.jSignature("setData", "data:" + sigData);
				}
			}
			
		},
		cpi: {
			saveToField: function() {
				var sigData = this.element.jSignature("getData", "base30");
				// update signature text field
				this.get("model").updateRow(this.get("row"), this.get("dataFieldId"), sigData[0] + ',' + sigData[1]);
			},
			clearData: function() {
				this.get("model").updateRow(this.get("row"), this.get("dataFieldId"), null);
				this.element.jSignature("reset");
			}
		},
		actions: {
			saveToField: function(actionDef, component) {
				component._getCPI().saveToField();
			},
			clearData: function(actionDef, component) {
				component._getCPI().clearData();
			},
		},
	});

})(skuid);