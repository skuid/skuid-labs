/* global CloneCondition */

if (arguments[0].hasOwnProperty('model')) {
	if (arguments[0].hasOwnProperty('conditionName')) {
		var initiatingCondition = arguments[0].model.getConditionByName(arguments[0].conditionName, true);
		if (initiatingCondition.hasOwnProperty('name')) {
			var conditionPrefix = initiatingCondition.name.substring(0, 3);
			if (conditionPrefix == 'CC_' || conditionPrefix == 'CA_' || conditionPrefix == 'CV_')
				CloneCondition(initiatingCondition.name, initiatingCondition);
			else if (initiatingCondition.name.substring(0, 14) == '__autofilter__') {
				CloneCondition("CC" + initiatingCondition.name, initiatingCondition);
				CloneCondition("CA" + initiatingCondition.name, initiatingCondition);
				CloneCondition("CV" + initiatingCondition.name, initiatingCondition);
			}
		}
	}
}
