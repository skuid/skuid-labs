// convert currency between iso codes and output string
skuid.formula.Formula(
	"CONVERT_CURRENCY",
	function (amount, defaultiso, useriso, roundto) {
		var convertedcurrency = skuid.utils.convertCurrency(amount, defaultiso, useriso),
			roundby = roundto || 1,
			roundedcurrency = Math.round(convertedcurrency / roundby) * roundby,
			currobj = {
				recordCurrency: useriso,
			};
		return skuid.currency.getDisplayValue(roundedcurrency, currobj);
	}, {
		numArgs: 4,
		returnType: "string"
	}
);