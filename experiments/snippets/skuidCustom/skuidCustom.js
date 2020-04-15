/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-extend-native */
/* eslint-disable no-undef */
const $ = skuid.$;

//Custom SKUID Functions
skuid.custom = {};


//Date.formatDate(date)
// formats a javascript date as YYYY-MM-DD for use with Salesforce
Date.formatDate = function (date) {
	const d = new Date(date);
	let month = `${(d.getMonth() + 1)}`;
	let day = `${d.getDate()}`;
	const year = d.getFullYear();

	if (month.length < 2) {
		month = `0${month}`;
	}
	if (day.length < 2) {
		day = `0${day}`;
	}

	return [year, month, day].join('-');
};
Date.prototype.formatDate = function () { 
	return Date.formatDate(this);
};

//Date.getDateFromSFDate(dateStr)
// Takes a Salesforce formatted date (YYYY-MM-DD) and converts it to a Javascript Date object
// returns Javascript date object
Date.getDateFromSFDate = function (dateStr) {
	if (dateStr === undefined || dateStr === null || typeof dateStr !== 'string') {
		return undefined;
	}
	
	const dateArr = dateStr.split('-');
	
	if (dateArr.length !== 3) {
		return undefined;
	}
	
	const year = dateArr[0];
	const month = dateArr[1];
	const day = dateArr[2];
	
	const yearInt = Number(year);
	const monthInt = Number(month);
	const dayInt = Number(day);
	
	const d = new Date(yearInt, monthInt - 1, dayInt);
	
	return d;
};

//Date.isLeapYear(year)
// Checks if a year is a leap year, returns true or false
Date.isLeapYear = function (year) {
	return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
};
Date.prototype.isLeapYear = function () { 
	return Date.isLeapYear(this.getFullYear()); 
};

//Date.getDaysInMonth(year,month)
// Given a year and a month returns the number of days in that month. Accounts for leap years.
Date.getDaysInMonth = function (year, month) {
	return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
Date.prototype.getDaysInMonth = function () { 
	return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

//Date.addMonths(months)
// Adds a number of months to a date, returns the updated date
Date.prototype.addMonths = function (months) {
	const n = this.getDate();
	this.setDate(1);
	this.setMonth(this.getMonth() + months);
	this.setDate(Math.min(n, this.getDaysInMonth()));
	return this;
};

//Date.addDays(days)
// adds a number of days to a date, returns the updated date
Date.prototype.addDays = function (days) {
	const date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};


//Object.byString(ourObject,fieldToGet);
// Able to get object's sub-objects with a single string variable
// instead of needing dot notation between multiple separate variables
// eg: Object.byString(ourObject,'Field__r.SubField__c')
// instead of needing to do ourObject['Field__r']['SubField__c'] or ourObject.Field__r.SubField__c
Object.byString = function (ourObject, fieldToGet) {
	let s = fieldToGet;
	let o = ourObject;
	s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	s = s.replace(/^\./, ''); // strip a leading dot
	const a = s.split('.');
	for (let i = 0, n = a.length; i < n; ++i) {
		const k = a[i];
		if (k in o) {
			o = o[k];
		} else {
			return;
		}
	}
	return o;
};

//skuid.custom.fixCurrency(number)
// remove anything past 2 digits after the decimal point for a number
// necessary to do after doing any mathematical operations between 2 floating point numbers
skuid.custom.fixCurrency = function (num) {
	//return Math.floor(num*100)/100;
	return parseFloat(num.toFixed(2));
};

//skuid.custom.clearArray(array)
// force-clears the data out of an array which may still otherwise have data in it
skuid.custom.clearArray = function (array) {
	while (array.length) {
		array.pop();
	}
};

//skuid.custom.operatorSOQL(operatorSafe)
// Converts an operator from SKUID XML/HTML safe format to SOQL format
skuid.custom.operatorSOQL = function (operatorSafe) {
	if (operatorSafe === 'gt') {
		return '>';
	} else if (operatorSafe === 'gte') {
		return '>=';
	} else if (operatorSafe === 'lt') {
		return '<';
	} else if (operatorSafe === 'lte') {
		return '<=';
	}

	return operatorSafe;
};

//skuid.custom.operatorSafe(operatorSOQL)
// Converts an operator from SOQL format to SKUID XML/HTML safe format
skuid.custom.operatorSafe = function (operatorSOQL) {
	if (operatorSOQL === '>') {
		return 'gt';
	} else if (operatorSOQL === '>=') {
		return 'gte';
	} else if (operatorSOQL === '<') {
		return 'lt';
	} else if (operatorSOQL === '<=') {
		return 'lte';
	}

	return operatorSOQL;
};

//skuid.custom.htmlEscape(string)
// HTML escape a string, for use when declaring XML for
// dynamic Template objects that require html escaped contents.
skuid.custom.htmlEscape = function (string) {
	// List of HTML entities for escaping.
	const htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;'
	};
	
	// Regex containing the keys listed immediately above.
	const htmlEscaper = /[&<>]/g;
	
	// Escape a string for HTML interpolation.
	return (`${string}`).replace(htmlEscaper, (match) => htmlEscapes[match]);
};

//skuid.custom.reRenderComponent(componentId)
// try to re-render a component, catching errors
skuid.custom.reRenderComponent = function (componentId) {
	const component = skuid.component.getById(componentId);
	if (component !== undefined && component.isRendered) {
		try {
			component.render();
		} catch (err) {
			console.log(`Cannot rerender: ${componentId}`);
			console.log(`Error: ${err}`);
		}
	}
};

//skuid.custom.waitForElement(fparams,callback)
// wait for an element to be ready on the screen before performing the callback function
// fparams = {
//	initEle: function to initialize the element / check if the element is initialized,
//		should return the initialized element. Takes context as a variable.
//	context: passed context or defaults to window
//	chunkTime: time between chunks, defaults to 250
// }
skuid.custom.waitForElement = function (fparams, callback) {
	fparams = fparams || {};
	initEle = fparams.initEle || undefined;
	context = fparams.context || window;
	chunkTime = fparams.chunkTime || 250;
	
	function doChunk() {
		const ele = initEle.call(context);
		if (typeof ele !== 'undefined') {
			let error = false;
			try {
				callback.call(context, ele);
			} catch (err) {
				error = true;
				console.log(`Still waiting for element.. Error: ${err}`);
			}
			
			if (!error) {
				console.log('Wait for element complete.');
				clearInterval(ourInterval);
			}
		} else {
			console.log('Still waiting for element..');
		}
	}
	
	//Keep trying to get the element and perform the callback until there isn't an error
	const ourInterval = setInterval(doChunk, chunkTime);
};


//skuid.custom.iterateArrayAsync(array, fn, chunkEndFn, endFn, maxTimePerChunk, context)
//	Iterate an array asynchronously
//	If iterating over Model Rows,
//	first get the rows into an array using model.getRows(), use that as the array variable
//	fn = the function to call while iterating over the array (for loop function call)
//	chunkEndFn (optional, use undefined if not using)
//	= the function to call when the chunk ends, used to update a loading message
//	endFn (optional, use undefined if not using) = called at the end of the async execution
//	last two args are optional
/*
//Usage
iterateArrayAsync(ourArray,function(value, index, array){
	//runs each iteration of the loop
},
function(row,length,percentDone){
	//runs after every chunk completes, this is optional, use undefined if not using this
},
function(){
	//runs after completing the loop, this is optional, use undefined if not using this
	
});
*/
skuid.custom.iterateArrayAsync = function (array, fn, chunkEndFn, endFn, maxTimePerChunk, context) {
	context = context || window;
	maxTimePerChunk = maxTimePerChunk || 200;
	let index = 0;

	function now() {
		return new Date().getTime();
	}

	function doChunk() {
		const startTime = now();
		while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
			// callback called with args (value, index, array)
			fn.call(context, array[index], index, array);
			++index;
		}
		if ((now() - startTime) > maxTimePerChunk && chunkEndFn !== undefined) {
			//callback called with args (row, length,percentDone)
			chunkEndFn.call(context, index, array.length, parseInt((index / array.length) * 100, 10));
		}
		if (index < array.length) {
			// set Timeout for async iteration
			setTimeout(doChunk, 1);
		} else if (endFn !== undefined) {
			endFn.call(context);
		}
	}    
	doChunk();    
};

//skuid.custom.iterateMapAsync(map, fn, chunkEndFn, endFn, maxTimePerChunk, context)
//	Iterate a map asynchronously
//	fn = the function to call while iterating over the map (for loop function call)
//	chunkEndFn (optional, use undefined if not using) = the function to call when the chunk ends,
//	used to update a loading message
//	endFn (optional, use undefined if not using) = called at the end of the async execution
//	last two args are optional
/*
//Usage
iterateMapAsync(ourMap,function(value, key, map){
	//runs each iteration of the loop
},
function(index,length,percentDone){
	//runs after every chunk completes, this is optional, use undefined if not using this
},
function(){
	//runs after completing the loop, this is optional, use undefined if not using this
	
});
*/
skuid.custom.iterateMapAsync = function (map, fn, chunkEndFn, endFn, maxTimePerChunk, context) {
	const array = Array.from(map.keys());
	context = context || window;
	maxTimePerChunk = maxTimePerChunk || 200;
	let index = 0;

	function now() {
		return new Date().getTime();
	}

	function doChunk() {
		const startTime = now();
		while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
			// callback called with args (value, key, map)
			fn.call(context, map.get(array[index]), array[index], map);
			++index;
		}
		if ((now() - startTime) > maxTimePerChunk && chunkEndFn !== undefined) {
			//callback called with args (index, length, percentDone)
			chunkEndFn.call(context, index, array.length, parseInt((index / array.length) * 100, 10));
		}
		if (index < array.length) {
			// set Timeout for async iteration
			setTimeout(doChunk, 1);
		} else if (endFn !== undefined) {
			endFn.call(context);
		}
	}    
	doChunk();
};

//skuid.custom.modelLoader(model,fparams);
//	Clear and Load all records in a model in chunks limited by the model's limit propery,
//	a passed limit, or otherwise if both are undefined defaults to 200.
//	Model can be Basic or Aggregate, both will load in chunks limited by the limit.
//	NOTE: Cannot use subquerying on aggregate models as we need to use OR
//		to run more than one query and OR is not allowed along with subqueries in SOQL
// 	Runs Asynchronously and works with $.when();
//	fparams: object
//	{
//		limit: Number of rows to limit by. If unspecified will choose
//			the model's recordsLimit property	or if that is unspecified defaults to 200
//		progressCallback: function to call before running each individual query
//			in the format progressCallback(fparams), fparams is an object
//			progressCallback fparams = {
//				count: count of rows queried so far
//				limit: our limit for how many rows to query per query run
//				nextStart: the row # of the next row to be queried,
//				nextEnd: the last row # to be queried (based on limit)
//			}
//		exportWhenDone: true or false for whether or not to export when done loading, default false
//		exportOptions: options object to pass to the export function for customized options
//	}
skuid.custom.modelLoader = function (model, fparams) {
	const deferred = $.Deferred();
	if (model === undefined) {
		deferred.reject('Model undefined');
		return deferred.promise();
	}

	fparams = fparams || {};

	const limit = fparams.limit || model.recordsLimit || 200;
	const exportWhenDone = fparams.exportWhenDone || false;
	const exportOptions = fparams.exportOptions || {};
	const progressCallback = fparams.progressCallback || undefined;

	//Set Initial Progress
	if (progressCallback !== undefined) {
		progressCallback.call(this, {
			count: 0,
			limit,
			nextStart: 1,
			nextEnd: limit
		});
	}
	model.abandonAllRows();

	//Run through our recursive function to load all rows
	modelLoadSOQL(model, {
		limit,
		progressCallback,
		promiseResolve: deferred.resolve,
		promiseReject: deferred.reject,
		exportWhenDone,
		exportOptions
	});

	function modelLoadSOQL(model, fparams) {
		fparams = fparams || {};
		const limit = fparams.limit || model.recordsLimit || 200;
		const last = fparams.last || undefined;
		const count = fparams.count || 0;
		let tempRows = fparams.tempRows || [];
		const progressCallback = fparams.progressCallback || undefined;
		const promiseResolve = fparams.promiseResolve || undefined;
		const promiseReject = fparams.promiseReject || undefined;
		const exportWhenDone = fparams.exportWhenDone || false;
		const exportOptions = fparams.exportOptions || {};

		const displayTypesToEnclose = ['STRING', 'ID', 'TEXT', 'TEXTAREA', 'PICKLIST', 'MULTIPICKLIST',
			'PHONE', 'REFERENCE', 'URL', 'EMAIL', 'ADDRESS', 'ENCRYPTEDSTRING'];
		//const displayTypesDontEnclose = ['DOUBLE', 'BOOLEAN', 'CURRENCY', 'DATE',
		//	'DATETIME', 'INTEGER', 'PERCENT'];

		let orderby = '';
		let having = '';
		let groupby = '';
		const groupbyItemsArr = [];

		let fieldsStr = '';

		//construct fields from model fields
		if (model.fields !== undefined) {
			for (let i = 0; i < model.fields.length; i++) {
				const f = model.fields[i];

				//skip UI only fields
				if (f.uiOnly === true) {
					continue;
				}

				let fieldBefore = '';
				let fieldAfter = '';
				const field = f.id;
				let fieldName = f.name || '';
				if (fieldName !== '') {
					fieldName = ` ${fieldName}`;	
				}
				//remove name for non-aggregate models
				if (model.isAggregate === false) {
					fieldName = '';
				}

				if (fieldsStr !== '') {
					fieldsStr += ',';
				}

				if (f.function !== undefined) {
					fieldBefore = `${f.function}(`;
					fieldAfter = ')';
				}

				fieldsStr += `${fieldBefore}${field}${fieldAfter}${fieldName}`;

				//if this is a group by field, add it to our groupby string and groupbyItemsArr
				if (model.isAggregate === true && f.groupable === true) {
					if (groupby !== '') {
						groupby += ',';
					}
					groupby += field;
					groupbyItemsArr.push(field);
				}
			}
		}

		//Get our conditions into an array of SOQL condition strings
		//	to put in the WHEN area of the query
		// if a condition is disabled, it will have a value of undefined in this array
		const ourConditions = parseConditionsSOQL(model.conditions);
		//abort query on undefined
		if (ourConditions === undefined) {
			promiseResolve({ aborted: true });
			return;
		}
		//Get our condition logic into an array of the format ['(',0, ' AND ', 1, ')']
		//	where numbers are positions in the parseConditionsSOQL array to include
		//	in the SOQL string and non-numbers are condition logic to include
		//	disabled conditions and the condition logic directly around
		//		disabled conditions are not included in the array
		const ourConditionLogic = parseConditionLogic(model.conditions, model.conditionLogic);
		if (ourConditionLogic === undefined) {
			promiseResolve({ aborted: true });
			return;
		}

		let ourConditionStrPre = '';
		let ourConditionStr = '';

		//iterate the returned condition logic
		for (let i = 0; i < ourConditionLogic.length; i++) {
			const cl = ourConditionLogic[i];

			//if the item is not a number, add it to our string
			//if the item is a number, get it out of the ourConditions array and add it
			if (isNaN(cl)) {
				ourConditionStr += cl;
			} else {
				ourConditionStr += ourConditions[cl];
			}
		}

		//Get our Last Row Conditions for querying the next iteration
		let lastRowConditions = '';
		
		if (!model.isAggregate) {
			//Basic Model

			//If we have a last row, set our lastRowConditions to only take Ids higher than our last Id
			if (last !== undefined) {
				lastRowConditions = `(Id > '${last.Id}')`;
			}

			//Make sure our model is ordered by Id
			orderby = ' ORDER BY Id';
		} else {
			//Aggregate Model

			//Set up our order by string based on our group by items
			for (let i = 0; i < groupbyItemsArr.length; i++) {
				if (orderby !== '') {
					orderby += ',';
				}

				orderby += groupbyItemsArr[i];
			}

			if (orderby !== '') {
				orderby = ` ORDER BY ${orderby}`;
			}

			//If we have a last row, set up our last row conditions
			if (last !== undefined) {
				lastRowConditions = '';
				const lrcArr = [];

				//Loop through our last row fields finding grouped fields to condition on
				for (const [key, value] of Object.entries(last)) {
					//Ignore attributes and non-grouped fields
					//Make sure to get the field Id from the field Name
					const aggFieldId = getAggFieldIdFromName(model, key);
					if (key !== 'attributes' && aggFieldId !== undefined 
							&& groupbyItemsArr.includes(aggFieldId)) {
						const obj = {};
						obj[aggFieldId] = value;
						lrcArr.push(obj);
					}
				}

				//while we still have group by fields to condition on, loop
				//constructing conditions to aggregately query the remaining rows we have not yet queried
				//pop the last element in lrcArr after each iteration
				//When complete this should give us a lastRowConditions string in the format
				// --
				//	(GroupByFieldA = ValueA AND GroupByFieldB = ValueB AND GroupByFieldC > Value C)
				//	OR
				//	(GroupByFieldA = ValueA AND GroupByFieldB > Value B)
				//	OR
				//	(GroupByFieldA > ValueA)
				//	--
				//	This ensures we query for the next X rows in the series
				//	and do not requery any already queried rows
				//	Note: Booleans cannot have '>' comparisons in SOQL.
				//	Instead we manually insert logic where we consider true > false
				while (lrcArr.length > 0) {
					let orCondition = '';
					//add OR if not the first condition
					if (lastRowConditions !== '') {
						orCondition = ' OR ';
					}

					let dontQueryNextBoolean = false;

					let thisCondition = '';

					let first = true;
					//loop through our last row group by fields
					$.each(lrcArr, (i, row) => {
						if (i === lrcArr.length - 1) {
							//If we're at the last field, set greater than condition
							//Loop through the fields
							for (const [key, value] of Object.entries(row)) {
								let enclose = false;
								let ourValue = value;
								if (displayTypesToEnclose.includes(model.fieldsMap[key].displaytype)) {
									enclose = true;
								}

								if (ourValue === null || ourValue === 'null') {
									if (enclose) {
										ourValue = '';
									} else {
										ourValue = 'NULL';
									}
								} else if (ourValue === true) {
									ourValue = 'true';
								} else if (ourValue === false) {
									ourValue = 'false';
								}

								//Ignore if boolean true
								if (model.fieldsMap[key].displaytype !== 'BOOLEAN' || (model.fieldsMap[key].displaytype === 'BOOLEAN' && ourValue === 'false')) {
									if (!first) {
										thisCondition += ' AND ';
									}

									if (model.fieldsMap[key].displaytype === 'BOOLEAN') {
										thisCondition += `${key} = true`;
									} else if (enclose) {
										thisCondition += `${key} > '${ourValue}'`;
									} else {
										thisCondition += `${key} > ${ourValue}`;
									}
								} else if ((model.fieldsMap[key].displaytype === 'BOOLEAN' && ourValue === 'true')) {
									dontQueryNextBoolean = true;
								}
							}
						} else {
							//If we're not at the last field, set equal condition
							for (const [key, value] of Object.entries(row)) {
								let enclose = false;
								let ourValue = value;

								if (displayTypesToEnclose.includes(model.fieldsMap[key].displaytype)) {
									enclose = true;
								}

								if (ourValue === null || ourValue === 'null') {
									if (enclose) {
										ourValue = '';
									} else {
										ourValue = 'NULL';
									}
								}

								if (!first) {
									thisCondition += ' AND ';
								}

								if (enclose) {
									thisCondition += `${key} = '${ourValue}'`;
								} else {
									thisCondition += `${key} = ${ourValue}`;
								}
							}
						}

						first = false;
					});

					//add to our lastRowConditions
					if (thisCondition !== '' && !dontQueryNextBoolean) {
						if (lastRowConditions === '') {
							lastRowConditions = '(';
						}
						lastRowConditions += `${orCondition}(${thisCondition})`;
					}

					//pop the last field to condition on
					lrcArr.pop();
				}

				if (lastRowConditions !== '') {
					lastRowConditions += ')';
				}
			}
		}

		let lastRowConditionsPre = '';

		//If we have Last Row conditions, need to add AND
		if (lastRowConditions !== '' && ourConditionStr !== '') {
			lastRowConditionsPre = ' AND ';
		}

		//If we have conditions, need to add WHERE
		if (ourConditionStr !== '' || lastRowConditions !== '') {
			ourConditionStrPre = ' WHERE ';
		}

		let groupbyPre = '';

		if (groupby !== '') {
			groupbyPre = ' GROUP BY ';
		}

		//Construct our HAVING strings
		let havingPre = '';

		if (model.havings !== undefined && model.havings.length > 0) {
			for (let i = 0; i < model.havings.length; i++) {
				const h = model.havings[i];
				const encloseValueInQuotes = h.encloseValueInQuotes;
				const fieldfunction = h.fieldfunction || '';
				const field = h.field;
				const value = h.value;
				const operator = operatorConvert(h.operator);
				let fieldPre = '';
				let fieldPost = '';
				let valuePre = '';
				let valuePost = '';

				//skip inactive fields
				if (h.inactive === true) {
					continue;
				} else {
					havingPre = ' HAVING ';
				}

				if (having === '') {
					having = '(';
				} else {
					having += ' AND ';
				}

				if (fieldfunction !== '') {
					fieldPre = '(';
					fieldPost = ')';
				}

				if (encloseValueInQuotes === true) {
					valuePre = '\'';
					valuePost = '\'';
				}

				having += `(${fieldfunction}${fieldPre}${field}${fieldPost} ${operator} ${valuePre}${value}${valuePost})`;
			}

			if (having !== '') {
				having += ')';
			}
		}

		const queryStr = `SELECT ${fieldsStr} FROM ${model.objectName}${ourConditionStrPre}${ourConditionStr}${lastRowConditionsPre}${lastRowConditions}${groupbyPre}${groupby}${havingPre}${having}${orderby} LIMIT ${limit}`;

		//console.log('QUERY:');
		//console.log(queryStr);

		skuid.$.when(skuid.sfdc.api.query(queryStr)).done(function (queryResult) {
			//Records is an array of query results in the format {field: value, field2: value2}
			const records = queryResult.records;

			if (records !== undefined && records !== null && records.length > 0) {
				for (let i = 0; i < records.length; i++) {
					//Remove attributes, we won't adopt that field into our rows
					if (records[i].attributes !== undefined) {
						delete records[i].attributes;
					}
				}

				//Adopt our rows into our tempModel
				tempRows = tempRows.concat(records);
			}
			
			if (records.length === limit) {
				//If we hit our query limit, we need to query again
				if (progressCallback !== undefined) {
					progressCallback.call(this, {
						count,
						limit,
						nextStart: count + records.length + 1,
						nextEnd: count + (records.length * 2)
					});
				}

				modelLoadSOQL(model, {
					limit,
					last: records[limit - 1],
					count: count + records.length,
					progressCallback,
					promiseResolve,
					promiseReject,
					tempRows,
					exportWhenDone,
					exportOptions
				});
			} else {
				//Otherwise we've finished querying, resolve
				//sort our tempRows based on original sorting parameters set in the model
				tempRows = sortRows(tempRows, model);

				//adopt our tempRows into our model
				model.adoptRows(tempRows);

				if (exportWhenDone) {
					skuid.$.when(model.exportData(exportOptions)).done((result) => {
						promiseResolve(result);
					}).fail((result) => {
						promiseReject(result.error);
					});
				} else {
					promiseResolve();
				}
			}
		}).fail((queryResult) => {
			promiseReject(queryResult.error);
		});

		function getAggFieldIdFromName(model, name) {
			if (model.isAggregate === false) {
				return name;
			}

			for (let i = 0; i < model.fields.length; i++) {
				if (model.fields[i].function === undefined && model.fields[i].name === name) {
					return model.fields[i].id;
				}
			}

			return name;
		}

		function getAggFieldNameFromId(model, id) {
			if (model.isAggregate === false) {
				return id;
			}

			for (let i = 0; i < model.fields.length; i++) {
				if (model.fields[i].function === undefined && model.fields[i].id === id) {
					return model.fields[i].name;
				}
			}

			return id;
		}

		function operatorConvert(operator) {
			if (operator === 'gt') {
				return '>';
			} else if (operator === 'gte') {
				return '>=';
			} else if (operator === 'lt') {
				return '<';
			} else if (operator === 'lte') {
				return '<=';
			}

			return operator;
		}

		//Pass an array of conditions
		//returns an array of the conditions translated into SOQL format
		//if no conditions exist, returns empty array
		//inactivated conditions will be undefined in the array
		//if we need to abort the query, returns undefined
		function parseConditionsSOQL(conditions) {
			if (conditions === undefined || conditions.length === 0) {
				return [];
			}

			const conditionsItems = [];

			//loop through conditions
			for (let i = 0; i < conditions.length; i++) {
				const c = conditions[i];

				//only pick up active conditions
				//if a condition is inactive push an element to the array to preserve condition ordering
				if (c.inactive === true) {
					conditionsItems.push(undefined);
				} else if (c.type === 'modelmerge') {
					const thisField = c.field;
					const mergeField = c.mergeField;
					let operator = operatorConvert(c.operator);
					const noValueBehavior = c.noValueBehavior;
					const mergeModel = skuid.model.getModel(c.model);
					const mergeModelFirstRow = mergeModel.getFirstRow();
					//If we have no row
					if (mergeModelFirstRow === undefined || mergeModelFirstRow === null) {
						//if noquery specified, abort query
						if (noValueBehavior === 'noquery') {
							return undefined;
						}
						//otherwise skip this condition
						
							conditionsItems.push(undefined);
					}
					let mergeModelFirstRowValue = mergeModel.getFieldValue(mergeModelFirstRow, mergeField, true);
					if (mergeModelFirstRowValue === undefined || mergeModelFirstRowValue === null) {
						mergeModelFirstRowValue = 'NULL';
					}
					const mergeModelData = mergeModel.data;
					const encloseValueInQuotes = c.encloseValueInQuotes;
					let precede = '';
					let valueBefore = '';
					let valueAfter = '';
					let value = '';
					
					if (operator.includes('start')) {
						operator = 'LIKE';
						valueAfter = '%';
					} else if (operator.includes('end')) {
						operator = 'LIKE';
						valueBefore = '%';
					} else if (operator.includes('contain')) {
						operator = 'LIKE';
						valueBefore = '%';
						valueAfter = '%';
					}
					
					if (operator.includes('does not')) {
						precede = 'NOT ';
					}

					//if in or not in, we need to iterate over the other model and include / exclude all those values
					if (operator === 'in' || operator === 'not in') {
						valueBefore = '(';
						valueAfter = ')';
						for (let j = 0; j < mergeModelData.length; j++) {
							const mr = mergeModelData[j];
							let mf = mergeModel.getFieldValue(mr, mergeField, true);

							if (mf === undefined || mf === null) {
								mf = 'NULL';
							}

							if (value !== '') {
								value += ',';
							}

							if (mf !== 'NULL' && encloseValueInQuotes) {
								value += `'${mf}'`;
							} else {
								value += mf;
							}
						}
					} else if (mergeModelFirstRow !== undefined && mergeModelFirstRow !== null) {
						if (mergeModelFirstRowValue !== 'NULL' && encloseValueInQuotes) {
							value = `'${mergeModelFirstRowValue}'`;
						} else {
							value = mergeModelFirstRowValue;
						}
					}

					//LIKE NULL set operator to = instead
					if (operator === 'LIKE' && value === 'NULL') {
						operator = '=';
					}
					//IN nothing set value to NULL instead
					if ((operator === 'in' || operator === 'not in') && value === '') {
						value = 'NULL';
					}
					
					conditionsItems.push(`(${precede}${thisField} ${operator} ${valueBefore}${value}${valueAfter})`);
				} else if (c.type === 'multiple') {
					//multiple specified values
					//Field in (
					//Field not in (
					let thisItem = `${c.field} ${c.operator} (`;

					if (c.values === undefined || c.values.length === 0) {
						thisItem += 'NULL';
					} else {
						for (let j = 0; j < c.values.length; j++) {
							const v = c.values[j];

							if (j !== 0) {
								thisItem += ',';
							}

							if (c.encloseValueInQuotes === true) {
								thisItem += `'${v}'`;
							} else {
								thisItem += `${v}`;
							}
						}
					}

					thisItem += ')';

					conditionsItems.push(thisItem);
				} else if (c.type === 'join') {
					//subquery
					const field = c.field;
					const subConditionLogic = c.subConditionLogic;
					//const encloseValueInQuotes = c.encloseValueInQuotes;
					const operator = operatorConvert(c.operator);
					//const fieldTargetObjects = c.fieldTargetObjects;
					const joinField = c.joinField;
					const joinObject = c.joinObject;
					//array of subconditions
					const subConditions = c.subConditions;
					//construct subcondition logic in string form
					let subConditionsParsed;
					let subConditionLogicParsed;

					let thisItem = `(${field} ${operator} (SELECT ${joinField} FROM ${joinObject}`;

					if (subConditions !== undefined && subConditions.length > 0) {
						thisItem += ' WHERE ';
						
						subConditionLogicParsed = parseConditionLogic(subConditions, subConditionLogic);
						//Abort if undefined
						if (subConditionLogicParsed === undefined) {
							return undefined;
						}
						subConditionsParsed = parseConditionsSOQL(subConditions);
						//Abort if undefined
						if (subConditionsParsed === undefined) {
							return undefined;
						}

						for (let j = 0; j < subConditionLogicParsed.length; j++) {
							const scl = subConditionLogicParsed[j];
							
							
							if (isNaN(scl)) {
								//If not a number, add to our thisItem string
								thisItem += scl;
							} else {
								//otherwise get from our subConditionsParsed array
								thisItem += subConditionsParsed[scl];
							}
						}
					}
					
					thisItem += '))';

					conditionsItems.push(thisItem);
				} else {
					//standard fieldvalue, userinfo, datasourceuserinfo
					let value = c.value;
					let operator = operatorConvert(c.operator);
					const noValueBehavior = c.noValueBehavior;

					if (noValueBehavior !== undefined && (value === undefined || value === '')) {
						if (noValueBehavior === 'deactivate') {
							conditionsItems.push(undefined);
							continue;
						} else if (noValueBehavior === 'noquery') {
							return undefined;
						}
					}

					if (value === undefined || value === null) {
						value = 'NULL';
					}

					let precede = '';
					
					if (operator.includes('start')) {
						operator = 'LIKE';
						value += '%';
					} else if (operator.includes('end')) {
						operator = 'LIKE';
						value = `%${value}`;
					} else if (operator.includes('contain')) {
						operator = 'LIKE';
						value = `%${value}%`;
					}
					
					if (operator.includes('does not')) {
						precede = 'NOT ';
					}
					
					if (value !== 'NULL' && c.encloseValueInQuotes) {
						value = `'${value}'`;
					}
					
					//LIKE NULL is invalid, switch operator to equals
					if (operator === 'LIKE' && value === 'NULL') {
						operator = '=';
					}
					
					conditionsItems.push(`(${precede}${c.field} ${operator} ${value})`);
				}
			}

			return conditionsItems;
		}

		function sortRows(rows, model) {
			if (model === undefined) {
				return rows;
			}

			const orderby = model.orderByClause;
			if (orderby === undefined || orderby === null || orderby === '') {
				return rows;
			}

			//turn orderby into an array of objects
			const orderbyArr = [];

			const orderbySplit = orderby.split(',');

			for (let i = 0; i < orderbySplit.length; i++) {
				let os = orderbySplit[i].trim();
				let field;
				let ascDesc;
				let nullsLast = false;

				//take care of nulls last condition
				if (os.toUpperCase().endsWith(' NULLS LAST')) {
					nullsLast = true;
					os = os.substring(0, os.length - 11).trim();
				}

				if (os.toUpperCase().endsWith('ASC')) {
					ascDesc = 'ASC';
					field = os.substring(0, os.length - 3).trim();
				} else if (os.toUpperCase().endsWith('DESC')) {
					ascDesc = 'DESC';

					field = os.substring(0, os.length - 4).trim();
				} else {
					field = os;
					ascDesc = 'ASC';
				}

				if (model.isAggregate === true) {
					field = getAggFieldNameFromId(model, field);
				}

				orderbyArr.push({ field, ascDesc, nullsLast });
			}


			rows.sort((a, b) => {
				for (let i = 0; i < orderbyArr.length; i++) {
					const ob = orderbyArr[i];
					const field = ob.field;
					const ascDesc = ob.ascDesc;
					const nullsLast = ob.nullsLast;

					const aField = Object.byString(a, field);
					const bField = Object.byString(b, field);

					if (nullsLast && aField === null && bField !== null) {
						return 1;
					}
					if (nullsLast && aField !== null && bField === null) {
						return -1;
					}
					
					if (aField < bField) {
						if (ascDesc === 'ASC') {
							return -1;
						} else if (ascDesc === 'DESC') {
							return 1;
						}
					} else if (aField > bField) {
						if (ascDesc === 'ASC') {
							return 1;
						} else if (ascDesc === 'DESC') {
							return -1;
						}
					}
				}

				return 0;
			});

			return rows;
		}

		Object.byString = function (o, s) {
			s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
			s = s.replace(/^\./, ''); // strip a leading dot
			const a = s.split('.');
			for (let i = 0, n = a.length; i < n; ++i) {
				const k = a[i];
				if (k in o) {
					o = o[k];
				} else {
					return;
				}
			}
			return o;
		};

		//Takes an array of conditions and a string of condition logic
		//Returns an array of strings and numbers
		//Strings are SOQL condition logic to directly embed (eg. AND OR ())
		//Numbers are array positions in the conditions array of those conditions
		//If undefined is returned, abort query
		function parseConditionLogic(conditions, conditionLogic) {
			if (conditionLogic === undefined || conditionLogic === '') {
				return [];
			}

			//always surround with parenthesis
			conditionLogic = `(${conditionLogic})`;
			

			let match = conditionLogic.match(/( AND )|([0-9]+)|([()])|( OR )/g);

			const ourConditions = parseConditionsSOQL(conditions);

			//abort query if undefined
			if (ourConditions === undefined) {
				return undefined;
			}
			
			match = deactivateLogic({ match, conditions, ourConditions });

			for (let i = 0; i < match.length; i++) {
				if (!isNaN(match[i])) {
					//fix to numerical index of condition itself
					match[i] = (Number(match[i]) - 1);
				}
			}
			
			//recursive function to deactivate logic
			function deactivateLogic(fparams) {
				fparams = fparams || {};
				let match = fparams.match || undefined;
				let index = fparams.index || undefined;
				const conditions = fparams.conditions || undefined;
				const deactivate = fparams.deactivate || false;
				const ourConditions = fparams.ourConditions || false;
				
				if (index === undefined) {
					//index is undefined, this is the base function call outside of recursion
					index = 0;
				} else if (match.length <= index) {
					//we got to the end of iteration, return match
					return match;
				}

				const m = match[index];
				
				
				if (!deactivate) {
					//we're not in deactivation mode
					if (!isNaN(m)) {
						//If this is a number
						const n = Number(m) - 1;
						//if this condition is inactive or has been deactivated in ourConditions due to missing rows, recurse to deactivate logic
						if (conditions[n].inactive === true || ourConditions[n] === undefined) {
							//remove the item
							match.splice(index, 1);
							//run over our match array fixing validity issues
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
							//rerun from scratch
							match = deactivateLogic({ match, conditions, ourConditions });
						} else if (index + 1 < match.length) {
							//otherwise it's valid let's iterate recursively
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions });
						}
					} else if (index + 1 < match.length) {
						//if this is not a number, iterate recursively
						match = deactivateLogic({ match, index: index + 1, conditions, ourConditions });
					}
				} else {
					//we're in deactivation mode, check match array for validity
					let lastItem;
					let lastIndex;
					if (index !== 0) {
						lastIndex = index - 1;
						lastItem = match[lastIndex];
					}
					let nextItem;
					let nextIndex;
					if (index !== match.length - 1) {
						nextIndex = index + 1;
						nextItem = match[nextIndex];
					}

					//get rid of touching AND/OR items or AND/OR that are preceded by '(' or have ')' after them
					if (m === ' AND ' || m === ' OR ') {
						if (lastItem === undefined) {
							//Remove this AND/OR
							match.splice(index, 1);
							//rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (nextItem === ' AND ' || nextItem === ' OR ' || nextItem === ')' || nextItem === undefined) {
							//Remove this AND/OR
							match.splice(index, 1);
							//rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (lastItem === ' AND ' || lastItem === ' OR ' || lastItem === '(') {
							//Remove this AND/OR
							match.splice(index, 1);
							//rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (index + 1 < match.length) {
							//nothing broken here, proceed to next index
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
						}
					} else if (m === '(') {
						//fix broken parenthesis
						if (nextItem === ')') {
							match.splice(index, 2);
							//rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (index + 1 < match.length) {
							//nothing broken here, proceed to next index
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
						}
					} else if (m === ')') {
						if (lastItem === undefined) {
							//Remove this )
							match.splice(index, 1);
							//rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (lastItem === '(') {
							match.splice(lastIndex, 2);
							//rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (index + 1 < match.length) {
							//nothing broken here, proceed to next index
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
						}
					} else if (index + 1 < match.length) {
						//nothing broken here, proceed to next index
						match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
					}
				}
				
				return match;
			}

			return match;
		}
	}

	return deferred.promise();
};
