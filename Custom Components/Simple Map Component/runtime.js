(function (skuid) {
	var $ = skuid.$;
	// Register a new Skuid Component Type
	skuid.componentType.register('skuiddemos__awesomemap', function (element, xmlDef) {

		element.addClass("awesomemap-content");
		// Establish a shorthand for the DOM element we will be building to,
		// (actually a jQuery object wrapper around that domElement)
		var self = element;
		// Get the name of the model we want to work with from our component definition,
		// as well as the Latitude and Longitude fields we want to work with.
		var modelName = xmlDef.attr('model'),
			latitudeField = xmlDef.attr('latitudefield'),
			longitudeField = xmlDef.attr('longitudefield'),
			apiKey = xmlDef.attr('apiKey');
		// If we do not have ALL of the first attributes,
		// then display an error in our domElement.
		if (!modelName || !latitudeField || !longitudeField) {
			self.text(
				'Error: Map Component could not be drawn. '
				+ 'A Model, Latitude Field, and Longitude Field must ALL be provided.'
			);
			return;
		}
		// Save our pin color to our element, for later use.
		self.pinColor = xmlDef.attr('pincolor') || 'green';
		// Use the Skuid JavaScript API
		// to get a reference to the requested Model.
		self.model = skuid.model.getModel(modelName);
		self.latitudeField = latitudeField;
		self.longitudeField = longitudeField;
		self.apiKey = apiKey;
		// Establish ourselves as a Skuid Editor on this Model.
		// We do not want to show the typical Editor header
		// or save/cancel buttons
		self.editor = new skuid.ui.Editor(self, {
			showHeader: false,
			showSaveCancel: false
		});
		// Register that we will be editing the specified Model.
		self.editor.registerModel(self.model);
		// Define the draw function,
		// which we will use for drawing our entire
		self.draw = function () {
			// Loop through the Case rows in our model
			// and create a marker for each Case
			self.markers = [];
			$.each(self.model.data, function (i, row) {
				var latitude = self.model.getFieldValue(row, self.latitudeField),
					longitude = self.model.getFieldValue(row, self.longitudeField);
				console.log(row);
				console.log(self.latitudeField);
				if (latitude != null && longitude != null) {
					self.markers.push(
						'&markers=color:' + self.pinColor
						+ '%7C' + latitude
						+ ',' + longitude
					);
				}
			});
			if (self.apiKey) self.markers.push('&key=' + self.apiKey);
			// Create a map using google static maps api,
			// removing any existing map that we may have from prior draws
			if (self.googlemap) self.googlemap.remove();
			self.googlemap = $('<img>')
				.attr('src', 'https://maps.googleapis.com/maps/api/staticmap?size=600x300'
					+ self.markers.join('')
					+ '&maptype=roadmap'
					+ '&sensor=false'
				)
				.css('margin-top', '8px')
				.appendTo(self);
		};
		// Define how we will handle successful 'saves' to our model
		self.editor.handleSave = function (modelHasChanged) {
			if (modelHasChanged) {
				// Redraw our Map
				self.draw();
			}
		};
		// Define how we will handle successful 'refreshes' to our model
		self.editor.handleDataRefresh = function () {
			// Redraw our Map
			self.draw();
		};
		// Make sure our Map is at least a certain height
		self.css('min-height', '300px');
		// Now, draw our map!
		self.draw();
	});
})(skuid);

