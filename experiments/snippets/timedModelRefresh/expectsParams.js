var model = skuid.$M(arguments[0].$Input.Model),
	refreshInSeconds = +arguments[0].$Input.Timeout || 10;

if (model) setInterval(function () {
	model.updateData();
}, refreshInSeconds * 1000);