window.ConditionProponents = {};
(function (skuid) {
  var $ = skuid.$;
  $(document.body).one('pageload', function () {
     var models = skuid.model.map();
     Object.keys(models).forEach(function (modelKey) {
        if (models[modelKey].hasOwnProperty('conditions')) {
           for (var conditionKey in models[modelKey].conditions) {
              if (models[modelKey].conditions.hasOwnProperty(conditionKey)) {
                 var condition = models[modelKey].conditions[conditionKey];
                 RecordCondition(condition);
              }
           }
        }
     });
  });
})(skuid);

function RecordCondition(condition) {
  if (condition.hasOwnProperty('name')) {
     var conditionPrefix = condition.name.substring(0, 3);
     if (conditionPrefix == "CC_" || conditionPrefix == "CA_" || conditionPrefix == "CV_") {
        if (!window.ConditionProponents.hasOwnProperty(condition.name))
           window.ConditionProponents[condition.name] = [];
        window.ConditionProponents[condition.name].push(condition);
     }
  }
  if (condition.hasOwnProperty('subConditions')) {
     for (var subConditionKey in condition.subConditions) {
        var subCondition = condition.subConditions[subConditionKey];
        RecordCondition(subCondition);
     }
  }
}

function CloneCondition(checkName, initiatingCondition) {
  var conditionPrefix = checkName.substring(0, 3);
  if (checkName && window.ConditionProponents.hasOwnProperty(checkName)) {
     for (var conditionKey in window.ConditionProponents[checkName]) {
        if (window.ConditionProponents[checkName].hasOwnProperty(conditionKey)) {
           var targetCondition = window.ConditionProponents[checkName][conditionKey];
           if (targetCondition !== initiatingCondition) {
              switch (conditionPrefix) {
                 case "CC_":
                    targetCondition.inactive = (initiatingCondition.inactive) ? true : false;
                    targetCondition.value = initiatingCondition.value;
                    targetCondition.values = initiatingCondition.values;
                    break;

                 case "CA_":
                    targetCondition.inactive = (initiatingCondition.inactive) ? true : false;
                    break;

                 case "CV_":
                    targetCondition.value = initiatingCondition.value;
                    targetCondition.values = initiatingCondition.values;
                    break;
              }
           }
        }
     }
  }
}
