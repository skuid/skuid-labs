/*
Action logging in Skuid! This adds console output for all actions called during page runtime.
Paste this into an **In-line** resource (not In-line Snippet) or include it as a page resource.
To enable, add 'actionloglevel=1' or 'actionloglevel=2' to the page url parameters.
Log level 1 will output the XML definition of each executed action, and log level 2 will also include the arguments for that action.
Special thanks to Zach McElrath for help finding where and how to override and extend the Skuid action function.
BIG DISCLAIMER: No guarantee this will continue to work through future Skuid upgrades, since it overrides a core function,
and does not use any documented or supported Skuid JS API stuff.
 */
if(skuid.page.params.actionloglevel) {
	var original = skuid.actions.runAction,
		$ = skuid.$,
		loglevel = parseInt(skuid.page.params.actionloglevel);
	skuid.lastActionTime = performance.now(); //Kinda helps with showing action durations, but... async, so... not reliable.
	if(loglevel > 2 || loglevel < 1) console.warn("Invalid actionlog level " + loglevel);
	skuid.actions.runAction = function(actionType, c, f, context) {
		var result = original.apply(this, arguments);
		var perfTime = "Skuid Action started after " + (performance.now() - skuid.lastActionTime).toFixed(4) + "ms";
		switch(actionType) { //Why? Because we may want to get granular in how we log individual action types
			default:
				switch(loglevel) {
					case 1:
						console.log(perfTime, c[0]);
						break;
					case 2:
						console.log(perfTime, c[0], $.extend(true, {}, arguments));
						break;
				}
				break;
		}
		skuid.lastActionTime = performance.now();
		return result;
	};
}