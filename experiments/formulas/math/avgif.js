// Conditional model column average
// average conditionally
// expects input of math__avgif('ModelName','AvgFieldId', 'IfFieldId','IfValue') for the corresponding model and field you want to average conditionally
// example: I want to find the average Oppty Amount where the Stage is Commit -> math__avgif('Oppty','Amount','StageName','Commit')
// Matt Davis

skuid.formula.Formula(
	'avgif',
	function (modelname, fieldname, iffield, ifvalue) {
		var model = skuid.$M(modelname),
			arr = model.getRows(),
			initialValue = 0;

		if (arr.length === 0) return 0;

		function filterByField(item) {
			return item[iffield] === ifvalue;
		}

		var sumif = arr
			.filter(filterByField);
			.reduce(function (accumulator, currentValue) {
				return accumulator + currentValue[fieldname];
			}, initialValue);

		return (sumif / filtarr.length);
	}, {
		defaultState: 'math__avgif("ModelName","AvgFieldId", "IfFieldId", "IfValue")',
		namespace: 'math',
		numArgs: 4,
		returnType: 'number'
	}
);