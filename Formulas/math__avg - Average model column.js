//avg field
//expects input of math__avg('ModelName','FieldId') for the corresponding model and field you want to average
//Matt Davis

skuid.formula.Formula (
	'avg',
	function (modelname, fieldname) {
		var model=skuid.$M(modelname),
			arr = model.data;
		var initialValue = 0;

		var sum = arr.reduce(function (accumulator, currentValue) {
			return accumulator + currentValue[fieldname];
		},initialValue)

		return (sum/arr.length);
	},{
		namespace: 'math',
		numArgs : 2,
		returnType : 'string'
	}
);