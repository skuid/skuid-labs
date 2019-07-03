//Converts CSV to Plus-Separated
skuid.formula.Formula(
	"SPACE2PLUS",
	function (fieldName) {
		return fieldName.replace(", ", "+");
	}, {
		numArgs: 1,
		returnType: "string"
	}
);
