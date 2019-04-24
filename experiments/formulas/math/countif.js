// Conditional model row counter
// average conditionally
// expects input of math__countif('ModelName','FieldId', 'ConiditionFieldId','ConditionValue') for the corresponding model and field you want to sum conditionally
// example: I want to find the average Oppty Amount where the Stage is Commit -> math__avgif('Oppty','Amount','StageName','Commit')
// Matt Davis

skuid.formula.Formula(
	'countif',
	function (modelname, fieldname, iffield, ifvalue) {
		var model = skuid.$M(modelname),
			arr = model.getRows();

		function filterByField(item) {
			return item[iffield] === ifvalue;
		}

		return arr.filter(filterByField).length;
	}, {
		defaultState: 'math__countif("ModelName","CountFieldId", "IfFieldId", "IfValue")',
		namespace: 'math',
		numArgs: 4,
		returnType: 'number'
	}
);