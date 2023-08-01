// Only tested in Chrome on Win & Mac
// Uses 1 unsupported Skuid API (skuid.aggregations)

// general function that does the "if" in mathif to filter model to records where iffield=ifvalue
function mathAggIf(mathtype, modelname, fieldname, iffield, ifvalue, blanks) {

	var model = skuid.$M(modelname);

	if (!model) throw "Invalid Model provided in formula function";

	var modelRows = model.getRows();

	function filterByField(item) {
		return skuid.utils.getObjectProperty(item, iffield) === ifvalue;
	}

	// skuid function that takes in these params, passes to filter function, and spits out the result
	return skuid.aggregations.aggregate(
		mathtype,
		model,
		fieldname,
		{
			countBlanks: blanks,
			rows: modelRows.filter(filterByField)
		}
	);
}

// SUM & SUMIF
skuid.formula.Formula(
	"SUM",
	// AGG__SUM(modelToAgg,fieldToAgg,countblanks) --- what to put in formula field, copy & paste this
	// since we can't have these functions show up as choices in the Functions dropdown.
	function(modelname, fieldname, blanks) { 
		return skuid.aggregations.aggregate("sum", skuid.$M(modelname), fieldname, {
			countBlanks: blanks
		});
	},
	{
		namespace: "AGG",
		numArgs: 3,
		returnType: "number"
	}
);

skuid.formula.Formula(
	"SUMIF",
	// AGG__SUMIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
	function(modelname, fieldname, iffield, ifvalue, blanks) {
		return mathAggIf("sum", modelname, fieldname, iffield, ifvalue, blanks);
	},
	{
		namespace: "AGG",
		numArgs: 5,
		returnType: "number"
	}
);

// AVG & AVGIF
skuid.formula.Formula(
	"AVG",
	// AGG__AVG(modelToAgg,fieldToAgg,countblanks)
	function(modelname, fieldname, blanks) { 
		return skuid.aggregations.aggregate("avg", skuid.$M(modelname), fieldname,  { countBlanks: blanks });
	},
	{
		namespace: "AGG",
		numArgs: 3,
		returnType: "number"
	}
);

skuid.formula.Formula(
	"AVGIF",
	// AGG__AVGIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
	function(modelname, fieldname, iffield, ifvalue, blanks) {
		return mathAggIf("avg", modelname, fieldname, iffield, ifvalue, blanks);
	},
	{
		namespace: "AGG",
		numArgs: 5,
		returnType: "number"
	}
);

// MIN & MINIF
skuid.formula.Formula(
	"MIN",
	// AGG__MIN(modelToAgg,fieldToAgg,countblanks)
	function(modelname, fieldname, blanks) { 
		return skuid.aggregations.aggregate("min", skuid.$M(modelname), fieldname, {countBlanks: blanks});
	},
	{
		namespace: "AGG",
		numArgs: 3,
		returnType: "number"
	}
);

skuid.formula.Formula(
	"MINIF",
	// AGG__MINIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
	function(modelname, fieldname, iffield, ifvalue, blanks) {
		return mathAggIf("min", modelname, fieldname, iffield, ifvalue, blanks);
	},
	{
		namespace: "AGG",
		numArgs: 5,
		returnType: "number"
	}
);

// MAX & MAXIF
skuid.formula.Formula(
	"MAX",
	// AGG__MAX(modelToAgg,fieldToAgg,countblanks)
	function(modelname, fieldname, blanks) { 
		return skuid.aggregations.aggregate("max",skuid.$M(modelname), fieldname, {
			countBlanks: blanks
		});
	},
	{
		namespace: "AGG",
		numArgs: 3,
		returnType: "number"
	}
);

skuid.formula.Formula(
	"MAXIF",
	// AGG__MAXIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
	function(modelname, fieldname, iffield, ifvalue, blanks) {
		return mathAggIf("max", modelname, fieldname, iffield, ifvalue, blanks);
	},
	{
		namespace: "AGG",
		numArgs: 5,
		returnType: "number"
	}
);

// COUNT & COUNTIF
skuid.formula.Formula(
	"COUNT",
	// AGG__COUNT(modelToAgg,fieldToAgg,countblanks)
	function(modelname, fieldname, blanks) { 
		return skuid.aggregations.aggregate("count", skuid.$M(modelname), fieldname, {
			countBlanks: blanks
		});
	},
	{
		namespace: "AGG",
		numArgs: 3,
		returnType: "number"
	}
);

skuid.formula.Formula(
	"COUNTIF",
	// AGG__COUNTIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
	function(modelname, fieldname, iffield, ifvalue, blanks) {
		return mathAggIf("count", modelname, fieldname, iffield, ifvalue, blanks);
	},
	{
		namespace: "AGG",
		numArgs: 5,
		returnType: "number"
	}
);

// MED & MEDIF
skuid.formula.Formula(
	"MED",
	// AGG__MED(modelToAgg,fieldToAgg,countblanks)
	function(modelname, fieldname, blanks) { 
		return skuid.aggregations.aggregate("med", skuid.$M(modelname), fieldname, {
			countBlanks: blanks
		});
	},
	{
		namespace: "AGG",
		numArgs: 3,
		returnType: "number"
	}
);

skuid.formula.Formula(
	"MEDIF",
	// AGG__MEDIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
	function(modelname, fieldname, iffield, ifvalue, blanks) {
		return mathAggIf("med", modelname, fieldname, iffield, ifvalue, blanks);
	},
	{
		namespace: "AGG",
		numArgs: 5,
		returnType: "number"
	}
);
