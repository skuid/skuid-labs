//Returns the correct ordinal suffix for a number
//ex. 1st, 2nd, 3rd etc. 
skuid.formula.Formula (
	'GET_ORDINAL',
	function (num) {
		if (num > 3 && num < 21) return 'th'; 
		switch (num % 10) {
			case 1:  return "st";
			case 2:  return "nd";
			case 3:  return "rd";
			default: return "th";
		}
	},{
		numArgs : 1,
		returnType : 'string'
	}
);
