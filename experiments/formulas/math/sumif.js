// Conditional model column sum
// sum conditionally
// expects input of math__sumif('ModelName','FieldId', 'ConditionFieldId','ConditionValue') for the corresponding model and field you want to sum conditionally
// example: I want to sum the Oppty Amount where the Stage is Commit -> math__sumif('Oppty','Amount','StageName','Commit')
// Matt Davis

skuid.formula.Formula(
	'sumif',
	function (modelname, fieldname, iffield, ifvalue) {
		var model = skuid.$M(modelname),
			arr = model.getRows(),
			initialValue = 0;

		function filterByField(item) {
			return item[iffield] === ifvalue;
		}

		var filtarr = arr.filter(filterByField);

		return filtarr.reduce(function (accumulator, currentValue) {
			return accumulator + currentValue[fieldname];
		}, initialValue);
	}, {
		defaultState: 'math__sumif("ModelName","SumFieldId","IfFieldId","IfValue")',
		namespace: 'math',
		numArgs: 4,
		returnType: 'number'
	}
);