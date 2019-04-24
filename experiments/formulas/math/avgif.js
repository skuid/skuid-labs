// Conditional model column average
// average conditionally
// expects input of math__avgif('ModelName','AvgFieldId', 'IfFieldId','IfValue') for the corresponding model and field you want to average conditionally
// example: I want to find the average Oppty Amount where the Stage is Commit -> math__avgif('Oppty','Amount','StageName','Commit')
// Matt Davis

skuid.formula.Formula(
	'avgif',
	function (modelname, fieldname, iffield, ifvalue) {
		var model = skuid.$M(modelname),
			arr = model.data,
			initialValue = 0;

		function filterByField(item) {
			return item[iffield] === ifvalue;
		}

		var filtarr = arr.filter(filterByField);

		var sumif = filtarr.reduce(function (accumulator, currentValue) {
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