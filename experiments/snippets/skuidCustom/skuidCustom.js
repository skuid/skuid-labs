/* eslint-disable no-trailing-spaces */
/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable semi */
/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-extend-native */
/* eslint-disable no-undef */
const $ = skuid.$;

// Custom SKUID Functions
skuid.custom = {};

// skuid.custom.isBlank(v)
// returns true for undefined, null, or ''
skuid.custom.isBlank = function (v) {
	return v === undefined || v === null || v === '';
};

// skuid.custom.blockUI(obj)
// blocks the UI with specified object as parameters to the blockUI function
// if the UI is already blocked, will instead update the existing block's message with obj.message
// rather than momentarily removing the block and replacing it with a new block
// as the standard blockUI function would do
skuid.custom.blockUI = function (obj) {
	if ($('.blockUI.blockMsg.blockPage') !== undefined && $('.blockUI.blockMsg.blockPage')[0] !== undefined && obj !== undefined && obj.message !== undefined) {
		$('.blockUI.blockMsg.blockPage')[0].textContent = obj.message;
	} else {
		$.blockUI(obj);
	}
};

// Date.isLeapYear(year)
// Checks if a year is a leap year, returns true or false
Date.isLeapYear = function (year) {
	return (year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0);
};
Date.prototype.isLeapYear = function () { 
	return Date.isLeapYear(this.getFullYear()); 
};

// Date.getDaysInMonth(year,month)
// Given a year and a month returns the number of days in that month. Accounts for leap years.
Date.getDaysInMonth = function (year, month) {
	return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
Date.prototype.getDaysInMonth = function () { 
	return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

// Date.addMonths(months)
// Adds a number of months to a date, returns the updated date
Date.prototype.addMonths = function (months) {
	const n = this.getDate();
	this.setDate(1);
	this.setMonth(this.getMonth() + months);
	this.setDate(Math.min(n, this.getDaysInMonth()));
	return this;
};

// Date.addDays(days)
// adds a number of days to a date, returns the updated date
Date.prototype.addDays = function (days) {
	const date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

// skuid.custom.fixCurrency(number)
// remove anything past 2 digits after the decimal point for a number
// necessary to do after doing any mathematical operations between 2 floating point numbers
skuid.custom.fixCurrency = function (num) {
	// return Math.floor(num*100)/100;
	return parseFloat(num.toFixed(2));
};

// String.random(length)
// Return a string of random (length) characters
String.random = function (length) {
	const radom13chars = function () {
		return Math.random().toString(16).substring(2, 15)
	}
	const loops = Math.ceil(length / 13)
	return new Array(loops).fill(radom13chars).reduce((string, func) => {
		return string + func()
	}, '').substring(0, length)
}

// skuid.custom.operatorSOQL(operatorSafe)
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

// skuid.custom.operatorSafe(operatorSOQL)
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

// skuid.custom.htmlEscape(string)
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

// skuid.custom.reRenderComponent(componentId)
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

// skuid.custom.waitForElement(fparams,callback)
// wait for an element to be ready on the screen before performing the callback function
// fparams = {
//	initEle: function to initialize the element / check if the element is initialized,
//		should return the initialized element. Takes context as a variable.
//	context: passed context or defaults to window
//	chunkTime: time between chunks, defaults to 250
// }
skuid.custom.waitForElement = function (fparams, callback) {
	fparams = fparams || {};
	const initEle = fparams.initEle || undefined;
	const element = fparams.element || undefined;
	const context = fparams.context || window;
	const chunkTime = fparams.chunkTime || 250;
	
	function doChunk () {
		let ele;
		if (initEle === undefined && element !== undefined) {
			ele = element;
		} else if (initEle !== undefined) {
			ele = initEle.call(context);
		}
		
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
	
	// Keep trying to get the element and perform the callback until there isn't an error
	const ourInterval = setInterval(doChunk, chunkTime);
};

// skuid.custom.createUpdateExistingRow(ourModel,row)
//  Create a row for an already existing Salesforce object with any specified fields acting as updates to the row when saving
//  createRow will normally assume the newly created row needs to be inserted, but if this is an existing row
//  we will instead be updating the row when saving the model
//  row is an object of field value pairs and must include a salesforce Id field
skuid.custom.createUpdateExistingRow = function (model, row) {
	if (row === undefined) {
		return false;
	}
	if (row.Id === undefined) {
		return false;
	}
	const retRows = model.adoptRows([{ Id: row.Id }], { doAppend: true });
	let retRow;
	if (retRows !== undefined && retRows.length > 0) {
		retRow = retRows[0];
	}

	const upd = row;
	delete upd.Id;
	if (upd !== {}) {
		model.updateRow(model.data[model.data.length - 1], upd);
	}

	return retRow;
}

// skuid.custom.createUpdateExistingRows(ourModel,rows)
//  Create rows for already existing Salesforce objects with any specified fields acting as updates to those rows when saving
//  createRow will normally assume the newly created row needs to be inserted, but if this is an existing row
//  we will instead be updating the row when saving the model
//  rows is an array of objects of field value pairs and must include a salesforce Id field
skuid.custom.createUpdateExistingRows = function (model, rows) {
	if (rows === undefined) {
		return false;
	}
	
	// Construct our adoptrows and updaterows array / object
	const rowsIds = [];
	const rowsUpdates = {};
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		if (row.Id === undefined) {
			return false;
		}

		const id = row.Id;
		rowsIds.push({ Id: id });
		delete row.Id;
		rowsUpdates[id] = row;
	}

	// First adopt the rows with just the row IDs
	let retRows = model.adoptRows(rowsIds, { doAppend: true });
	if (retRows === undefined) {
		return false;
	}

	// Now update the rows with all the other fields as updates
	// This causes all these rows / fields to be treated as needing to be updated when saved
	// which doesn't happen on a regular adoptRows as set up in the above adoptRows function call
	retRows = model.updateRows(rowsUpdates);

	return retRows;
}

// skuid.custom.iterateArrayAsync(array, fn, chunkEndFn, endFn, maxTimePerChunk, context)
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
skuid.custom.iterateArrayAsync(ourArray,function(value, index, array){
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

	function now () {
		return new Date().getTime();
	}

	function doChunk () {
		const startTime = now();
		while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
			// callback called with args (value, index, array)
			fn.call(context, array[index], index, array);
			++index;
		}
		if ((now() - startTime) > maxTimePerChunk && chunkEndFn !== undefined) {
			// callback called with args (row, length,percentDone)
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

// skuid.custom.iterateMapAsync(map, fn, chunkEndFn, endFn, maxTimePerChunk, context)
//	Iterate a map asynchronously
//	fn = the function to call while iterating over the map (for loop function call)
//	chunkEndFn (optional, use undefined if not using) = the function to call when the chunk ends,
//	used to update a loading message
//	endFn (optional, use undefined if not using) = called at the end of the async execution
//	last two args are optional
/*
//Usage
skuid.custom.iterateMapAsync(ourMap,function(value, key, map){
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

	function now () {
		return new Date().getTime();
	}

	function doChunk () {
		const startTime = now();
		while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
			// callback called with args (value, key, map)
			fn.call(context, map.get(array[index]), array[index], map);
			++index;
		}
		if ((now() - startTime) > maxTimePerChunk && chunkEndFn !== undefined) {
			// callback called with args (index, length, percentDone)
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

// skuid.custom.modelLoader(model[],fparams);
//	Clear and Load all records in a model in chunks limited by the model's limit propery,
//	a passed limit, or otherwise if both are undefined defaults to 200.
//	Model can be Basic or Aggregate, both will load in chunks limited by the limit.
//  Can take as a parameter a single model, or an array of models
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
//				model: the current model being queried
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

	if (Array.isArray(model)) {
		if (model.length > 0) {
			const m = model[0];
			const limit = fparams.limit || undefined;
			const localLimit = fparams.limit || m.recordsLimit || 200;
			const exportWhenDone = fparams.exportWhenDone || false;
			const exportOptions = fparams.exportOptions || {};
			const progressCallback = fparams.progressCallback || undefined;

			// Set Initial Progress
			if (progressCallback !== undefined) {
				progressCallback.call(this, {
					count: 0,
					limit: localLimit,
					nextStart: 1,
					nextEnd: localLimit,
					model: m
				});
			}
			m.abandonAllRows();

			modelLoadSOQL(m, {
				limit: limit,
				progressCallback: progressCallback,
				promiseResolve: deferred.resolve,
				promiseReject: deferred.reject,
				exportWhenDone: exportWhenDone,
				exportOptions: exportOptions,
				modelArrayPosition: 0,
				modelArray: model
			});
		}
	} else {
		const limit = fparams.limit || undefined;
		const localLimit = fparams.limit || model.recordsLimit || 200;
		const exportWhenDone = fparams.exportWhenDone || false;
		const exportOptions = fparams.exportOptions || {};
		const progressCallback = fparams.progressCallback || undefined;

		// Set Initial Progress
		if (progressCallback !== undefined) {
			progressCallback.call(this, {
				count: 0,
				limit: localLimit,
				nextStart: 1,
				nextEnd: localLimit,
				model: model
			});
		}
		model.abandonAllRows();

		// Run through our recursive function to load all rows
		modelLoadSOQL(model, {
			limit: limit,
			progressCallback: progressCallback,
			promiseResolve: deferred.resolve,
			promiseReject: deferred.reject,
			exportWhenDone: exportWhenDone,
			exportOptions: exportOptions
		});
	}

	function modelLoadSOQL (model, fparams) {
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
		const modelArrayPosition = fparams.modelArrayPosition || 0;
		const modelArray = fparams.modelArray || undefined;
		let limitSpecified = fparams.limitSpecified;

		if (limitSpecified === undefined) {
			if (fparams.limit !== undefined) {
				limitSpecified = true;
			} else {
				limitSpecified = false;
			}
		}

		const displayTypesToEnclose = ['STRING', 'ID', 'TEXT', 'TEXTAREA', 'PICKLIST', 'MULTIPICKLIST',
			'PHONE', 'REFERENCE', 'URL', 'EMAIL', 'ADDRESS', 'ENCRYPTEDSTRING'];
		// const displayTypesDontEnclose = ['DOUBLE', 'BOOLEAN', 'CURRENCY', 'DATE',
		//	'DATETIME', 'INTEGER', 'PERCENT'];

		let orderby = '';
		let having = '';
		let groupby = '';
		const groupbyItemsArr = [];

		let fieldsStr = '';

		let noIdField = true;

		// construct fields from model fields
		if (model.fields !== undefined) {
			for (let i = 0; i < model.fields.length; i++) {
				const f = model.fields[i];

				// skip UI only fields and non-querying fields
				if (f.uiOnly === true || f.query === false) {
					continue;
				}

				let fieldBefore = '';
				let fieldAfter = '';
				const field = f.id;

				if (field === 'Id') {
					noIdField = false;
				}
				
				let fieldName = escapeSOQL(f.name) || '';
				if (fieldName !== '') {
					fieldName = ` ${fieldName}`;	
				}
				// remove name for non-aggregate models
				if (model.isAggregate === false) {
					fieldName = '';
				}

				if (fieldsStr !== '') {
					fieldsStr += ',';
				}

				// If this is a child relationship field
				if (f.type !== undefined && f.type === 'childRelationship') {

				}

				if (f.function !== undefined) {
					fieldBefore = `${f.function}(`;
					fieldAfter = ')';
				}

				fieldsStr += `${fieldBefore}${field}${fieldAfter}${fieldName}`;

				// if this is a group by field, add it to our groupby string and groupbyItemsArr
				if (model.isAggregate === true && f.groupable === true && (f.function === undefined || f.function === null)) {
					if (groupby !== '') {
						groupby += ',';
					}
					groupby += field;
					groupbyItemsArr.push(field);
				}
			}
		}

		// Need to add ID field to query if none exists
		if (model.isAggregate === false && noIdField === true) {
			if (fieldsStr !== '') {
				fieldsStr += ',';
			}

			fieldsStr += 'Id';
		}

		// Get our conditions into an array of SOQL condition strings
		//	to put in the WHEN area of the query
		// if a condition is disabled, it will have a value of undefined in this array
		const ourConditions = parseConditionsSOQL(model.conditions);
		// abort query on undefined
		if (ourConditions === undefined) {
			promiseResolve({ aborted: true });
			return;
		}
		// Get our condition logic into an array of the format ['(',0, ' AND ', 1, ')']
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

		// iterate the returned condition logic
		for (let i = 0; i < ourConditionLogic.length; i++) {
			const cl = ourConditionLogic[i];

			// if the item is not a number, add it to our string
			// if the item is a number, get it out of the ourConditions array and add it
			if (isNaN(cl)) {
				ourConditionStr += cl;
			} else {
				ourConditionStr += ourConditions[cl];
			}
		}

		// Get our Last Row Conditions for querying the next iteration
		let lastRowConditions = '';
		
		if (!model.isAggregate) {
			// Basic Model

			// If we have a last row, set our lastRowConditions to only take Ids higher than our last Id
			if (last !== undefined) {
				lastRowConditions = `(Id > '${last.Id}')`;
			}

			// Make sure our model is ordered by Id
			orderby = ' ORDER BY Id';
		} else {
			// Aggregate Model

			// Set up our order by string based on our group by items
			for (let i = 0; i < groupbyItemsArr.length; i++) {
				if (orderby !== '') {
					orderby += ',';
				}

				orderby += groupbyItemsArr[i];
			}

			if (orderby !== '') {
				orderby = ` ORDER BY ${orderby}`;
			}

			// If we have a last row, set up our last row conditions
			if (last !== undefined) {
				lastRowConditions = '';
				const lrcArr = [];

				// Loop through our last row fields finding grouped fields to condition on
				for (const [key, value] of Object.entries(last)) {
					// Ignore attributes and non-grouped fields
					// Make sure to get the field Id from the field Name
					const aggFieldId = getAggFieldIdFromName(model, key);
					if (key !== 'attributes' && aggFieldId !== undefined && groupbyItemsArr.includes(aggFieldId)) {
						const obj = {};
						obj[aggFieldId] = value;
						lrcArr.push(obj);
					}
				}

				// while we still have group by fields to condition on, loop
				// constructing conditions to aggregately query the remaining rows we have not yet queried
				// pop the last element in lrcArr after each iteration
				// When complete this should give us a lastRowConditions string in the format
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
					// add OR if not the first condition
					if (lastRowConditions !== '') {
						orCondition = ' OR ';
					}

					let dontQueryNextBoolean = false;

					let thisCondition = '';

					let first = true;
					// loop through our last row group by fields
					$.each(lrcArr, (i, row) => {
						if (i === lrcArr.length - 1) {
							// If we're at the last field, set greater than condition
							// Loop through the fields
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

								// Ignore if boolean true
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
							// If we're not at the last field, set equal condition
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

					// add to our lastRowConditions
					if (thisCondition !== '' && !dontQueryNextBoolean) {
						if (lastRowConditions === '') {
							lastRowConditions = '(';
						}
						lastRowConditions += `${orCondition}(${thisCondition})`;
					}

					// pop the last field to condition on
					lrcArr.pop();
				}

				if (lastRowConditions !== '') {
					lastRowConditions += ')';
				}
			}
		}

		let lastRowConditionsPre = '';

		// If we have Last Row conditions, need to add AND
		if (lastRowConditions !== '' && ourConditionStr !== '') {
			lastRowConditionsPre = ' AND ';
		}

		// If we have conditions, need to add WHERE
		if (ourConditionStr !== '' || lastRowConditions !== '') {
			ourConditionStrPre = ' WHERE ';
		}

		let groupbyPre = '';

		if (groupby !== '') {
			groupbyPre = ' GROUP BY ';
		}

		// Construct our HAVING strings
		let havingPre = '';

		if (model.havings !== undefined && model.havings.length > 0) {
			for (let i = 0; i < model.havings.length; i++) {
				const h = model.havings[i];
				const encloseValueInQuotes = h.encloseValueInQuotes;
				const fieldfunction = h.fieldfunction || '';
				const field = h.field;
				const value = h.value;
				const operator = skuid.custom.operatorSOQL(h.operator);
				let fieldPre = '';
				let fieldPost = '';
				let valuePre = '';
				let valuePost = '';

				// skip inactive fields
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

		let limitStr = ` LIMIT ${limit}`;

		// Aggregate models that have no group by fields should not have a limit
		if (model.isAggregate && groupby === '') {
			limitStr = '';
		}

		const queryStr = `SELECT ${fieldsStr} FROM ${model.objectName}${ourConditionStrPre}${ourConditionStr}${lastRowConditionsPre}${lastRowConditions}${groupbyPre}${groupby}${havingPre}${having}${orderby}${limitStr}`;

		skuid.sfdc.api.query(queryStr).done(function (queryResult) {
			// Records is an array of query results in the format {field: value, field2: value2}
			const records = queryResult.records;

			if (records !== undefined && records !== null && records.length > 0) {
				for (let i = 0; i < records.length; i++) {
					// Remove attributes, we won't adopt that field into our rows
					if (records[i].attributes !== undefined) {
						delete records[i].attributes;
					}
				}

				// Adopt our rows into our tempModel
				tempRows = tempRows.concat(records);
			}
			
			if (limitStr !== '' && records.length === limit) {
				// If we hit our query limit, we need to query again
				if (progressCallback !== undefined) {
					progressCallback.call(this, {
						count: count,
						limit: limit,
						nextStart: count + records.length + 1,
						nextEnd: count + (records.length * 2),
						model: model
					});
				}

				modelLoadSOQL(model, {
					limit: limit,
					last: records[limit - 1],
					count: count + records.length,
					progressCallback: progressCallback,
					promiseResolve: promiseResolve,
					promiseReject: promiseReject,
					tempRows: tempRows,
					exportWhenDone: exportWhenDone,
					exportOptions: exportOptions,
					modelArrayPosition: modelArrayPosition,
					modelArray: modelArray,
					limitSpecified: limitSpecified
				});
			} else {
				let nextQuery = 0;
				// If we have a next model to query, next query will be > 0, otherwisw will be 0
				if (modelArray !== undefined && (modelArrayPosition + 1) < modelArray.length) {
					nextQuery = (modelArrayPosition + 1);
				}

				// Otherwise we've finished querying, resolve
				// sort our tempRows based on original sorting parameters set in the model
				tempRows = sortRows(tempRows, model);

				// adopt our tempRows into our model
				model.adoptRows(tempRows);

				if (exportWhenDone) {
					skuid.$.when(model.exportData(exportOptions)).done((result) => {
						if (nextQuery === 0) {
							promiseResolve(result);
						} else {
							let localLimit = modelArray[nextQuery].recordsLimit || 200;

							if (limitSpecified) {
								localLimit = limit;
							}

							// Set Initial Progress
							if (progressCallback !== undefined) {
								progressCallback.call(this, {
									count: 0,
									limit: localLimit,
									nextStart: 1,
									nextEnd: localLimit,
									model: modelArray[nextQuery]
								});
							}
							modelArray[nextQuery].abandonAllRows();
							// Recurse to next model to load
							modelLoadSOQL(modelArray[nextQuery], {
								limit: localLimit,
								progressCallback: progressCallback,
								promiseResolve: promiseResolve,
								promiseReject: promiseReject,
								exportWhenDone: exportWhenDone,
								exportOptions: exportOptions,
								modelArrayPosition: nextQuery,
								modelArray: modelArray,
								limitSpecified: limitSpecified
							});
						}
					}).fail((result) => {
						promiseReject(result.error);
					});
				} else {
					if (nextQuery === 0) {
						promiseResolve();
					} else {
						let localLimit = modelArray[nextQuery].recordsLimit || 200;

						if (limitSpecified) {
							localLimit = limit;
						}
						// Set Initial Progress
						if (progressCallback !== undefined) {
							progressCallback.call(this, {
								count: 0,
								limit: localLimit,
								nextStart: 1,
								nextEnd: localLimit,
								model: modelArray[nextQuery]
							});
						}
						modelArray[nextQuery].abandonAllRows();
						// Recurse to next model to load
						modelLoadSOQL(modelArray[nextQuery], {
							limit: localLimit,
							progressCallback: progressCallback,
							promiseResolve: promiseResolve,
							promiseReject: promiseReject,
							exportWhenDone: exportWhenDone,
							exportOptions: exportOptions,
							modelArrayPosition: nextQuery,
							modelArray: modelArray,
							limitSpecified: limitSpecified
						});
					}
				}
			}
		}).fail((queryResult) => {
			promiseReject(queryResult.error);
		});

		function getAggFieldIdFromName (model, name) {
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

		function getAggFieldNameFromId (model, id) {
			if (model.isAggregate === false) {
				return id;
			}

			const field = model.getField(id);

			if (field.function === undefined) {
				return field.name;
			}

			return id;
		}

		// Pass an array of conditions
		// returns an array of the conditions translated into SOQL format
		// if no conditions exist, returns empty array
		// inactivated conditions will be undefined in the array
		// if we need to abort the query, returns undefined
		function parseConditionsSOQL (conditions) {
			if (conditions === undefined || conditions.length === 0) {
				return [];
			}

			const conditionsItems = [];

			// loop through conditions
			for (let i = 0; i < conditions.length; i++) {
				const c = conditions[i];

				// only pick up active conditions
				// if a condition is inactive push an element to the array to preserve condition ordering
				if (c.inactive === true) {
					conditionsItems.push(undefined);
				} else if (c.type === 'modelmerge') {
					const thisField = c.field;
					const mergeField = c.mergeField;
					let operator = skuid.custom.operatorSOQL(c.operator);
					const noValueBehavior = c.noValueBehavior;
					const mergeModel = skuid.model.getModel(c.model);
					const mergeModelFirstRow = mergeModel.getFirstRow();
					// If we have no row
					if (mergeModelFirstRow === undefined || mergeModelFirstRow === null) {
						// if noquery specified, abort query
						if (noValueBehavior === 'noquery') {
							return undefined;
						}
						// otherwise skip this condition
						
							conditionsItems.push(undefined);
					}
					let mergeModelFirstRowValue = escapeSOQL(mergeModel.getFieldValue(mergeModelFirstRow, mergeField, true));
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

					// if in or not in, we need to iterate over the other model and include / exclude all those values
					if (operator === 'in' || operator === 'not in') {
						valueBefore = '(';
						valueAfter = ')';
						for (let j = 0; j < mergeModelData.length; j++) {
							const mr = mergeModelData[j];
							let mf = escapeSOQL(mergeModel.getFieldValue(mr, mergeField, true));

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

					// LIKE NULL set operator to = instead
					if (operator === 'LIKE' && value === 'NULL') {
						operator = '=';
					}
					// IN nothing set value to NULL instead
					if ((operator === 'in' || operator === 'not in') && value === '') {
						value = 'NULL';
					}
					
					conditionsItems.push(`(${precede}${thisField} ${operator} ${valueBefore}${value}${valueAfter})`);
				} else if (c.type === 'multiple') {
					// multiple specified values
					// Field in (
					// Field not in (
					let thisItem = `${c.field} ${c.operator} (`;

					if (c.values === undefined || c.values.length === 0) {
						thisItem += 'NULL';
					} else {
						for (let j = 0; j < c.values.length; j++) {
							const v = escapeSOQL(c.values[j]);

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
					// subquery
					const field = c.field;
					const subConditionLogic = c.subConditionLogic;
					// const encloseValueInQuotes = c.encloseValueInQuotes;
					const operator = skuid.custom.operatorSOQL(c.operator);
					// const fieldTargetObjects = c.fieldTargetObjects;
					const joinField = c.joinField;
					const joinObject = c.joinObject;
					// array of subconditions
					const subConditions = c.subConditions;
					// construct subcondition logic in string form
					let subConditionsParsed;
					let subConditionLogicParsed;

					let thisItem = `(${field} ${operator} (SELECT ${joinField} FROM ${joinObject}`;

					if (subConditions !== undefined && subConditions.length > 0) {
						thisItem += ' WHERE ';
						
						subConditionLogicParsed = parseConditionLogic(subConditions, subConditionLogic);
						// Abort if undefined
						if (subConditionLogicParsed === undefined) {
							return undefined;
						}
						subConditionsParsed = parseConditionsSOQL(subConditions);
						// Abort if undefined
						if (subConditionsParsed === undefined) {
							return undefined;
						}

						for (let j = 0; j < subConditionLogicParsed.length; j++) {
							const scl = subConditionLogicParsed[j];
							
							if (isNaN(scl)) {
								// If not a number, add to our thisItem string
								thisItem += scl;
							} else {
								// otherwise get from our subConditionsParsed array
								thisItem += subConditionsParsed[scl];
							}
						}
					}
					
					thisItem += '))';

					conditionsItems.push(thisItem);
				} else {
					// standard fieldvalue, userinfo, datasourceuserinfo
					let value = escapeSOQL(c.value);
					let operator = skuid.custom.operatorSOQL(c.operator);
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
					
					// LIKE NULL is invalid, switch operator to equals
					if (operator === 'LIKE' && value === 'NULL') {
						operator = '=';
					}
					
					conditionsItems.push(`(${precede}${c.field} ${operator} ${value})`);
				}
			}

			return conditionsItems;
		}

		function sortRows (rows, model) {
			if (model === undefined) {
				return rows;
			}

			const orderby = model.orderByClause;
			if (orderby === undefined || orderby === null || orderby === '') {
				return rows;
			}

			// turn orderby into an array of objects
			const orderbyArr = [];

			const orderbySplit = orderby.split(',');

			for (let i = 0; i < orderbySplit.length; i++) {
				let os = orderbySplit[i].trim();
				let field;
				let ascDesc;
				let nullsLast = false;

				// take care of nulls last condition
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

					const aField = skuid.utils.getObjectProperty(a, field);
					const bField = skuid.utils.getObjectProperty(b, field);

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

		// Takes an array of conditions and a string of condition logic
		// Returns an array of strings and numbers
		// Strings are SOQL condition logic to directly embed (eg. AND OR ())
		// Numbers are array positions in the conditions array of those conditions
		// If undefined is returned, abort query
		function parseConditionLogic (conditions, conditionLogic) {
			if (conditionLogic === undefined || conditionLogic === '') {
				return [];
			}

			const hasOr = conditionLogic.match(/( OR )/gi);

			// If there is an OR in the condition logic, surround with parenthesis
			// Otherwise it is not necessary to surround with parenthesis and surrounding
			// with parenthesis may cause certain queries (that involve subquerues) to fail
			if (hasOr !== null && hasOr !== undefined) {
				conditionLogic = `(${conditionLogic})`;
			}
			
			let match = conditionLogic.match(/([ ]*AND[ ]*)|([0-9]+)|([()])|([ ]*OR[ ]*)/gi);

			const ourConditions = parseConditionsSOQL(conditions);

			// abort query if undefined
			if (ourConditions === undefined) {
				return undefined;
			}
			
			match = deactivateLogic({ match, conditions, ourConditions });

			for (let i = 0; i < match.length; i++) {
				if (!isNaN(match[i])) {
					// fix to numerical index of condition itself
					match[i] = (Number(match[i]) - 1);
				} else if (match[i] !== undefined && (match[i].toUpperCase() === 'AND' || match[i].toUpperCase() === 'AND ' || match[i].toUpperCase() === ' AND' || match[i].toUpperCase() === ' AND ')) {
					match[i] = ' AND ';
				} else if (match[i] !== undefined && (match[i].toUpperCase() === 'OR' || match[i].toUpperCase() === 'OR ' || match[i].toUpperCase() === ' OR' || match[i].toUpperCase() === ' OR ')) {
					match[i] = ' OR ';
				}
			}
			
			// recursive function to deactivate logic
			function deactivateLogic (fparams) {
				fparams = fparams || {};
				let match = fparams.match || undefined;
				let index = fparams.index || undefined;
				const conditions = fparams.conditions || undefined;
				const deactivate = fparams.deactivate || false;
				const ourConditions = fparams.ourConditions || false;
				
				if (index === undefined) {
					// index is undefined, this is the base function call outside of recursion
					index = 0;
				} else if (match.length <= index) {
					// we got to the end of iteration, return match
					return match;
				}

				const m = match[index];
				
				if (!deactivate) {
					// we're not in deactivation mode
					if (!isNaN(m)) {
						// If this is a number
						const n = Number(m) - 1;
						// if this condition is inactive or has been deactivated in ourConditions due to missing rows, recurse to deactivate logic
						if (conditions[n].inactive === true || ourConditions[n] === undefined) {
							// remove the item
							match.splice(index, 1);
							// run over our match array fixing validity issues
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
							// rerun from scratch
							match = deactivateLogic({ match, conditions, ourConditions });
						} else if (index + 1 < match.length) {
							// otherwise it's valid let's iterate recursively
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions });
						}
					} else if (index + 1 < match.length) {
						// if this is not a number, iterate recursively
						match = deactivateLogic({ match, index: index + 1, conditions, ourConditions });
					}
				} else {
					// we're in deactivation mode, check match array for validity
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

					// get rid of touching AND/OR items or AND/OR that are preceded by '(' or have ')' after them
					if (m === ' AND ' || m === ' OR ') {
						if (lastItem === undefined) {
							// Remove this AND/OR
							match.splice(index, 1);
							// rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (nextItem === ' AND ' || nextItem === ' OR ' || nextItem === ')' || nextItem === undefined) {
							// Remove this AND/OR
							match.splice(index, 1);
							// rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (lastItem === ' AND ' || lastItem === ' OR ' || lastItem === '(') {
							// Remove this AND/OR
							match.splice(index, 1);
							// rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (index + 1 < match.length) {
							// nothing broken here, proceed to next index
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
						}
					} else if (m === '(') {
						// fix broken parenthesis
						if (nextItem === ')') {
							match.splice(index, 2);
							// rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (index + 1 < match.length) {
							// nothing broken here, proceed to next index
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
						}
					} else if (m === ')') {
						if (lastItem === undefined) {
							// Remove this )
							match.splice(index, 1);
							// rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (lastItem === '(') {
							match.splice(lastIndex, 2);
							// rerun deactivation check from scratch
							match = deactivateLogic({ match, conditions, ourConditions, deactivate: true });
						} else if (index + 1 < match.length) {
							// nothing broken here, proceed to next index
							match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
						}
					} else if (index + 1 < match.length) {
						// nothing broken here, proceed to next index
						match = deactivateLogic({ match, index: index + 1, conditions, ourConditions, deactivate: true });
					}
				}
				
				return match;
			}

			return match;
		}
	}

	function escapeSOQL (v) {
		if (v === undefined || v === null || typeof v !== 'string') {
			return v;
		}
		return v.replace(/'/g, '\\\'');
	}

	return deferred.promise();
};

// skuid.custom.modelSaver(model[],fparams)
// Saves a model incrementally as to not overload the save process with too many saves at once
// Can take as a parameter a single model or an array of models
//	fparams: object
//	{
//		limit: Number of rows to limit by. If unspecified will choose
//			the model's recordsLimit property or if that is unspecified defaults to 100
//		progressCallback: function to call before running each individual query
//			in the format progressCallback(fparams), fparams is an object
//			progressCallback fparams = {
//				count: count of rows saved so far
//				limit: our limit for how many rows to save per run
//				nextStart: the row # of the next row to be saved
//				nextEnd: the last row # to be saved (based on limit)
//				model: the model currently being saved
//			}
//	}
skuid.custom.modelSaver = function (model, fparams) {
	const deferred = $.Deferred();
	if (model === undefined) {
		deferred.reject('Model undefined');
		return deferred.promise();
	}

	fparams = fparams || {};

	if (Array.isArray(model)) {
		if (model.length > 0) {
			const m = model[0];

			const localLimit = fparams.limit || m.recordsLimit || 100;
			const limit = fparams.limit || undefined;
			const progressCallback = fparams.progressCallback || undefined;

			// Set Initial Progress
			if (progressCallback !== undefined) {
				progressCallback.call(this, {
					count: 0,
					limit: localLimit,
					nextStart: 1,
					nextEnd: localLimit,
					model: m,
					percentDone: 0
				});
			}

			// Back up the changes object from the model and clear it
			// We will only save the changes we want to save
			m.changesTemp = m.changes;
			m.changes = {};

			// Run through our recursive function to save all rows
			modelSave(m, {
				limit: limit,
				progressCallback: progressCallback,
				promiseResolve: deferred.resolve,
				promiseReject: deferred.reject,
				modelArray: model,
				modelArrayPosition: 0
			});
		}
	} else {
		const limit = fparams.limit || undefined;
		const localLimit = fparams.limit || model.recordsLimit || 100;
		const progressCallback = fparams.progressCallback || undefined;

		// Set Initial Progress
		if (progressCallback !== undefined) {
			progressCallback.call(this, {
				count: 0,
				limit: localLimit,
				nextStart: 1,
				nextEnd: localLimit,
				model: model,
				percentDone: 0
			});
		}

		// Back up the changes object from the model and clear it
		// We will only save the changes we want to save
		model.changesTemp = model.changes;
		model.changes = {};

		// Run through our recursive function to save all rows
		modelSave(model, {
			limit: limit,
			progressCallback: progressCallback,
			promiseResolve: deferred.resolve,
			promiseReject: deferred.reject
		});
	}

	function modelSave (model, fparams) {
		fparams = fparams || {};
		const limit = fparams.limit || model.recordsLimit || 100;
		const count = fparams.count || 0;
		const progressCallback = fparams.progressCallback || undefined;
		const promiseResolve = fparams.promiseResolve || undefined;
		const promiseReject = fparams.promiseReject || undefined;
		const modelArray = fparams.modelArray || undefined;
		const modelArrayPosition = fparams.modelArrayPosition || 0;
		let limitSpecified = fparams.limitSpecified;

		if (limitSpecified === undefined) {
			if (fparams.limit !== undefined) {
				limitSpecified = true;
			} else {
				limitSpecified = false;
			}
		}
		
		let localCount = 0;
		for (const [key, value] of Object.entries(model.changesTemp)) {
			// Only process up to limit
			if (localCount >= limit) {
				break;
			}

			// Move from our temp changes back to changes
			model.changes[key] = value;
			// Make sure the model is set to hasChanged
			model.hasChanged = true;
			// Delete our temp key
			delete model.changesTemp[key];

			localCount++;
		}

		// Save the model
		if (Object.keys(model.changes).length > 0) {
			$.when(model.save()).done(f => {
				if (Object.keys(model.changesTemp).length > 0) {
					// If we still have changesTemp
					if (progressCallback !== undefined) {
						// Call our progressCallback if defined
						let localEnd = limit;
						if (Object.keys(model.changesTemp).length < localEnd) {
							localEnd = Object.keys(model.changesTemp).length;
						}
						progressCallback.call(this, {
							count: count + localCount,
							limit: limit,
							nextStart: count + localCount + 1,
							nextEnd: count + localCount + localEnd,
							model: model,
							percentDone: parseInt(((count + localCount) / model.data.length) * 100, 10)
						});
					}

					// Recurse our modelSave
					modelSave(model, {
						limit: limit,
						count: (count + localCount),
						progressCallback: progressCallback,
						promiseResolve: promiseResolve,
						promiseReject: promiseReject,
						modelArray: modelArray,
						modelArrayPosition: modelArrayPosition,
						limitSpecified: limitSpecified
					});
				} else {
					// We have no remaining changesTemp, resolve
					delete model.changesTemp;
					model.hasChanged = false;

					let nextQuery = 0;
					// If we have a next model to query, next query will be > 0, otherwisw will be 0
					if (modelArray !== undefined && (modelArrayPosition + 1) < modelArray.length) {
						nextQuery = (modelArrayPosition + 1);
					}
					
					if (nextQuery === 0) {
						promiseResolve();
					} else {
						let localLimit = modelArray[nextQuery].recordsLimit || 100;
						if (limitSpecified) {
							localLimit = limit;
						}
						// Set Initial Progress
						if (progressCallback !== undefined) {
							progressCallback.call(this, {
								count: 0,
								limit,
								nextStart: 1,
								nextEnd: localLimit,
								model: modelArray[nextQuery],
								percentDone: 0
							});
						}

						// Back up the changes object from the model and clear it
						// We will only save the changes we want to save
						modelArray[nextQuery].changesTemp = modelArray[nextQuery].changes;
						modelArray[nextQuery].changes = {};

						// Recurse our modelSave
						modelSave(modelArray[nextQuery], {
							limit: localLimit,
							progressCallback: progressCallback,
							promiseResolve: promiseResolve,
							promiseReject: promiseReject,
							modelArray: modelArray,
							modelArrayPosition: nextQuery,
							limitSpecified: limitSpecified
						});
					}
				}
			}).fail(f => {
				if (Object.keys(model.changesTemp).length === 0) {
					model.hasChanged = false;
				}
				// Save failed, reject
				for (const [key, value] of Object.entries(model.changesTemp)) {
					// Move from our temp changes back to changes
					model.changes[key] = value;
					// Make sure the model is set to hasChanged
					model.hasChanged = true;
					// Delete our temp key
					delete model.changesTemp[key];
				}
				delete model.changesTemp;
				
				promiseReject(f);
			});
		} else {
			// No changes were needed, resolve
			delete model.changesTemp;
			model.hasChanged = false;
			
			let nextQuery = 0;
			// If we have a next model to query, next query will be > 0, otherwisw will be 0
			if (modelArray !== undefined && (modelArrayPosition + 1) < modelArray.length) {
				nextQuery = (modelArrayPosition + 1);
			}
			
			if (nextQuery === 0) {
				promiseResolve();
			} else {
				let localLimit = modelArray[nextQuery].recordsLimit || 100;
				if (limitSpecified) {
					localLimit = limit;
				}

				// Set Initial Progress
				if (progressCallback !== undefined) {
					progressCallback.call(this, {
						count: 0,
						limit,
						nextStart: 1,
						nextEnd: localLimit,
						model: modelArray[nextQuery],
						percentDone: 0
					});
				}

				// Back up the changes object from the model and clear it
				// We will only save the changes we want to save
				modelArray[nextQuery].changesTemp = modelArray[nextQuery].changes;
				modelArray[nextQuery].changes = {};

				// Recurse our modelSave
				modelSave(modelArray[nextQuery], {
					limit: localLimit,
					progressCallback: progressCallback,
					promiseResolve: promiseResolve,
					promiseReject: promiseReject,
					modelArray: modelArray,
					modelArrayPosition: nextQuery,
					limitSpecified: limitSpecified
				});
			}
		}
	}

	return deferred.promise();
};
