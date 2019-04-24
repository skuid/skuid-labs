// Sum model column
// sum field
// expects input of math__sum('ModelName','SumFieldId') for the corresponding model and field you want to sum
// Matt Davis

skuid.formula.Formula(
	'sum',
	function (modelname, fieldname) {
		var model = skuid.$M(modelname),
			arr = model.data,
			initialValue = 0;

		return arr.reduce(function (accumulator, currentValue) {
			return accumulator + currentValue[fieldname];
		}, initialValue);
	}, {
		defaultState: 'math__sum("ModelName","SumFieldId")',
		namespace: 'math',
		numArgs: 2,
		returnType: 'number'
	}
);