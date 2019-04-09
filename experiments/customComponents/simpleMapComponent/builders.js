(function (skuid) {
	var $ = skuid.$;
	skuid.builder.core.registerBuilder(new skuid.builder.core.Builder({
		id: "skuiddemos__awesomemap",
		name: "Awesome Map",
		icon: "sk-bi-navigation",
		description: "This component builds a map with pins on it.",
		componentRenderer: function (component) {
			var self = component;
			component.header.html(component.builder.name);
		},
		propertiesRenderer: function (propertiesObj, component) {
			propertiesObj.setHeaderText('Map Properties');
			var propsList = [
				{
					id: 'model'
					, type: 'model'
					, label: 'Model'
					, required: true
					, onChange: function (value) {
					}
				}
				, {
					id: 'latitudefield'
					, type: 'field'
					, modelprop: 'model'
					, label: 'Latitude Field'
					, helptext: 'The field on the selected Model which stores a row\'s Latitude'
				}
				, {
					id: 'longitudefield'
					, type: 'field'
					, modelprop: 'model'
					, label: 'Longitude Field'
					, helptext: 'The field on the selected Model which stores a row\'s Longitude'
				}
				, {
					id: 'pincolor'
					, type: 'string'
					, label: 'Pin Color'
					, helptext: '24 bit color, or one of the following: black, brown, green,'
						+ ' purple, yellow, blue, gray, orange, red, white'
				}
				, {
					id: 'apiKey'
					, type: 'string'
					, label: "Google Maps API key"
				}
			];
			var propsEditor = skuid.builder.buildPropsEditor(component.state, propsList);
			propertiesObj.body.append(propsEditor);
		},
		defaultStateGenerator: function () {
			return skuid.utils.makeXMLDoc('<skuiddemos__awesomemap pincolor="green"/>');
		}
	}));
})(skuid);
