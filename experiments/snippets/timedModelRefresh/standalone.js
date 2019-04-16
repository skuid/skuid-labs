// To be used as an inline snippet
var model = skuid.$M('MyModel'),
	refreshInSeconds = 5;

if (model) setInterval(function () {
	model.updateData();
}, refreshInSeconds * 1000);