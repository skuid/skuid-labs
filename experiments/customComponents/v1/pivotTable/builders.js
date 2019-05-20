(function (skuid) {
	var $ = skuid.$;

	skuid.builder.core.registerBuilder(new skuid.builder.core.Builder({
		id: "skuiddemos__pivottable",
		name: "Pivot Table",
		icon: "sk-bi-table slightly-askance",
		description: "You can tell it's a pivot table by the way that it is.",
		componentRenderer: function (component) {
			var self = component;
			component.setTitle(component.builder.name);
		},
		propertiesRenderer: function (propertiesObj, component) {
			propertiesObj.setHeaderText('Pivot Table Properties');

			var bc = skuid.builder.core,
				builder = skuid.builder,
				state = component.state,
				sv = skuid.visualizations,
				svc = sv.core,
				modelName = state.attr('model'),
				modelXML = bc.getModelFromModelName(modelName),
				modelIsAggregate,
				dataSource, dataSourceType;
			if (modelXML) {
				modelIsAggregate = modelXML && (modelXML.attr('type') === 'aggregate');
				dataSource = skuid.dataSource.getDataSource(modelXML.attr('datasource'));
				dataSourceType = dataSource && dataSource.dataSourceType;
			}

			var modelFields = svc.getModelFieldsOptions(modelName),
				modelFieldsWithNoneOption = $.merge([{"label": "-- None Selected --", "value": ""}], modelFields);

			var basicPropsList = [
				{
					id: 'model'
					, type: 'model'
					, label: 'Model'
					, required: true
					, onChange: function () {
						state.attr('rowField', "");
						state.attr('columnField', "");
						state.attr('valueField', "");
						component.refresh().rebuildProps();
					}
				}, {
					id: 'rowField'
					, type: 'picklist'
					, label: 'Row Field'
					, defaultValue: ""
					, helptext: "The field containing the record's value to be used as the pivot table\'s \"Row\""
					, picklistEntries: modelFieldsWithNoneOption
				}, {
					id: 'showRowTotals'
					, type: 'boolean'
					, label: 'Show Row Totals'
					, defaultValue: false
				}, {
					id: 'columnField'
					, type: 'picklist'
					, label: 'Column Field'
					, defaultValue: ""
					, helptext: "The field containing the record's value to be used as the pivot table\'s \"Column\""
					, picklistEntries: modelFieldsWithNoneOption
				}, {
					id: 'showColumnTotals'
					, type: 'boolean'
					, label: 'Show Column Totals'
					, defaultValue: false
				}, {
					id: 'aggFunction',
					type: 'picklist',
					label: 'Aggregate Function',
					defaultValue: 'count',
					picklistEntries: [
						{label: 'Count', value: 'count'},
						{label: 'Sum', value: 'sum'},
						{label: "Average", value: "average"},
						{label: "Min", value: "min"},
						{label: "Max", value: "max"}
					],
					onChange: function () {
						component.refresh().rebuildProps();
					}
				}];

			var aggFunction = component.state[0].attributes.aggFunction ? component.state[0].attributes.aggFunction.value : false,
				valueLabel = "Sum Field";

			switch (aggFunction) {
				case "min":
					valueLabel = "Min Field";
					break;
				case "max":
					valueLabel = "Max Field";
					break;
				default:
					break;
			}

			switch (aggFunction) {
				case "sum":
				case "average":
				case "min":
				case "max":
					basicPropsList.push({
						id: 'valueField'
						, type: 'picklist'
						, label: valueLabel
						, defaultValue: ""
						, helptext: "The value field on the record to be applied in the aggregate function"
						, picklistEntries: modelFieldsWithNoneOption
					});
					break;

				default:
					break;
			}
			//TODO: Conditionally render this?
			if (aggFunction === "average" || aggFunction === "count") basicPropsList.push(
				{
					id: 'countField'
					, type: 'picklist'
					, label: 'Count Field'
					, defaultValue: ""
					, helptext: "The count field on the record to be applied for the Count or Average functions. " +
						"Typically for a Basic Model, this can be left as 'Assume 1'"
					, picklistEntries: $.merge([{"label": "-- Assume 1 --", "value": ""}], modelFields)
					, onChange: function () {
						//TODO: Validate?
						//component.refresh().rebuildProps();
					}
				}
			);

			basicPropsList.push({
				id: 'roundField'
				, type: 'number'
				, label: 'Rounding'
				, defaultValue: false
				, helptext: "Number of decimal places for rounding. Leave blank for no rounding."
			});

			var advancedPropsList = [
				bc.coreProps.uniqueIdProp({component: component}),
				builder.cssClassProp
			];

			var sortingPropsList = [
				{
					id: 'rowSort',
					type: 'picklist',
					label: 'Sort Rows By',
					defaultValue: 'none',
					picklistEntries: [
						{label: '-None-', value: 'none'},
						{label: 'Title Ascending', value: 'titleasc'},
						{label: 'Title Descending', value: 'titledesc'},
						{label: 'Row Total Ascending', value: 'totalasc'},
						{label: 'Row Total Descending', value: 'totaldesc'}
					],
					onChange: function () {
						component.refresh().rebuildProps();
					}
				},
				{
					id: 'columnSort',
					type: 'picklist',
					label: 'Sort Columns By',
					defaultValue: 'none',
					picklistEntries: [
						{label: '-None-', value: 'none'},
						{label: 'Title Ascending', value: 'titleasc'},
						{label: 'Title Descending', value: 'titledesc'},
						{label: 'Column Total Ascending', value: 'totalasc'},
						{label: 'Column Total Descending', value: 'totaldesc'}
					],
					onChange: function () {
						component.refresh().rebuildProps();
					}
				}
			];

			propertiesObj.applyPropsWithCategories(
				[
					{
						name: 'Basic',
						props: basicPropsList
					},
					{
						name: 'Advanced',
						props: advancedPropsList
					},
					{
						name: 'Sorting',
						props: sortingPropsList
					},
					bc.getRenderingCategory({
						component: component,
						model: null,
						propViewer: propertiesObj
					}),
					bc.getContextCategory({
						propViewer: propertiesObj,
						state: state,
						model: state.attr('model')
					})
				], state
			);
		}
		,
		defaultStateGenerator: function () {
			return skuid.utils.makeXMLDoc('<skuiddemos__pivottable />');
		}

	}));

	//Check if the value evaluates to true and is also not the string value of "false". Useful for XML prop reading.
	function trueish(value) {
		return value && (typeof value.toLowerCase == "undefined" || value.toLowerCase() !== "false");
	}

})(skuid);