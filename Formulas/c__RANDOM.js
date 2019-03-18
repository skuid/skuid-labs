//Do not use this as part of a UI-Only field formula. Only on update or add row actions.
skuid.formula.Formula(
	'RANDOM',
	function (low, high, asFloat) {
		asFloat = asFloat === undefined ? false : Boolean(asFloat);
		var result = Math.random() * (high - low) + low;
		return asFloat ? result : Math.round(result);
	}, {
		numArgs: 3,
		returnType: 'Number'
	}
);
