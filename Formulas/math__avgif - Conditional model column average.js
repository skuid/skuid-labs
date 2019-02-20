//average conditionally
//expects input of math__avgif('ModelName','FieldId', 'ConiditionFieldId','ConditionValue') for the corresponding model and field you want to sum conditionally
//example: I want to find the average Oppty Amount where the Stage is Commit -> math__avgif('Oppty','Amount','StageName','Commit')
//Matt Davis

skuid.formula.Formula(
	'avgif',
	function (modelname, fieldname, iffield, ifvalue) {
		model = skuid.$M(modelname),
			arr = model.data;
		var initialValue = 0;

		function filterByField(item) {
			if (item[iffield] === ifvalue) {
				return true;
			}
			return false;
		}

		var filtarr = arr.filter(filterByField);

		var sumif = filtarr.reduce(function (accumulator, currentValue) {
			return accumulator + currentValue[fieldname];
		}, initialValue)

		return (sumif / filtarr.length);
	}, {
		namespace: 'math',
		numArgs: 4,
		returnType: 'number'
	}
);