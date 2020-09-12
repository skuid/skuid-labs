var debugging = false;

var params = arguments[0],
	sourceModelName = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("SourceModel") ? params.$Input.SourceModel : false,
	sourceModelIDField = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("SourceModelIDField") ? params.$Input.SourceModelIDField : false,
	sourceModel = sourceModelName ? skuid.$M(sourceModelName) : false,
	sourceModelRows = sourceModel ? sourceModel.getRows() : false,
	destModelName = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("DestinationModel") ? params.$Input.DestinationModel : false,
	destModelIDField = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("DestinationModelIDField") ? params.$Input.DestinationModelIDField : false,
	destModel = destModelName ? skuid.$M(destModelName) : false,
	destModelRows = destModel ? destModel.getRows() : false,
	create = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("Create") ? trueish(params.$Input.Create) : false,
	update = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("Update") ? trueish(params.$Input.Update) : false,
	del = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("Delete") ? trueish(params.$Input.Delete) : false,
	append = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("Append") ? trueish(params.$Input.Append) : false,
	idOnly = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("IDOnly") ? trueish(params.$Input.IDOnly) : false,
	iterations = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("Iterations") && create && !update && !del && parseInt(params.$Input.Iterations) ? Math.max(parseInt(params.$Input.Iterations), 1) : 1,
	excludes = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("ExcludeFields") ? params.$Input.ExcludeFields : "",
	includes = params.hasOwnProperty("$Input") && params.$Input.hasOwnProperty("IncludeFields") ? params.$Input.IncludeFields : "",
	sourceRecordRegistry = {}, //Records with ID's
	sourceRecordNew = [], //Records without ID's, presumably new records
	destRecordRegistry = {}, //Records with ID's
	contextRows = params.hasOwnProperty("context") && params.context.hasOwnProperty("rows") ?
		params.context.rows :
		params.hasOwnProperty("context") && params.context.hasOwnProperty("rows") ?
			[params.context.row] :
			false,
	contextModel = contextRows && contextRows.length && contextRows[0].hasOwnProperty("model") ?
		contextRows[0].model :
		params.hasOwnProperty("context") && params.context.hasOwnProperty("model") ?
			params.context.model :
			false
;

excludes = excludes.split(",");
includes = includes.split(",");
for (var e = 0; e < excludes.length; e++) excludes[e] = excludes[e].trim();

let fieldMap = buildFieldMap(sourceModel, sourceModelIDField, destModel, destModelIDField, idOnly, excludes, includes);
if (!fieldMap) return false;


if (debugging)
	console.log({
		sourceModelName: sourceModelName,
		sourceModelIDField: sourceModelIDField,
		destModelName: destModelName,
		destModelIDField: destModelIDField,
		sourceModel: sourceModel,
		destModel: destModel,
		sourceModelRows: sourceModelRows,
		destModelRows: destModelRows,
		create: create,
		update: update,
		del: del,
		idOnly: idOnly,
		sourceRecordRegistry: sourceRecordRegistry,
		destRecordRegistry: destRecordRegistry,
		contextModel: contextModel,
		contextRows: contextRows,
		fieldMap: fieldMap,
		context: params.context
	});

if (contextRows && contextModel) {
	if (contextModel !== sourceModel) console.warn("Source Model " + sourceModel.id + " is not the same as Context Model " + contextModel.id);
	else {
		sourceModel = contextModel;
		sourceModelRows = contextRows;
	}
}

if (!sourceModel) {
	console.error("No source model found");
	return false;
}
if (!destModel) {
	console.error("No destination model found");
	return false;
}

//Populate sourceRecordRegistry and sourceRecordNew
if (sourceModelIDField && sourceModelRows) {
	for (var i = 0; i < sourceModelRows.length; i++) {
		if (sourceModelRows[i].hasOwnProperty(sourceModelIDField) && sourceModelRows[i][sourceModelIDField]) sourceRecordRegistry[sourceModelRows[i][sourceModelIDField]] = sourceModelRows[i];
		else sourceRecordNew.push(sourceModelRows[i]);
	}
}

//Populate destRecordRegistry, and possibly mark new rows for removal
if (destModelIDField && destModelRows) {
	for (var i = 0; i < destModelRows.length; i++) {
		if (destModelRows[i].hasOwnProperty(destModelIDField) && destModelRows[i][destModelIDField]) destRecordRegistry[destModelRows[i][destModelIDField]] = destModelRows[i];
		else {
			//Do we delete?
			if (del) destModel.deleteRow(destModelRows[i]);
		}
	}
}

//Mark rows in destRecordRegistry for deletion if not found in sourceRecordRegistry
if (del && destModelRows && destModelRows.length) {
	if (!sourceModelIDField || !destModelIDField) {
		console.error("Cannot perform Delete without specified ID fields");
		return false;
	}
	for (var destID in destRecordRegistry) {
		if (destRecordRegistry.hasOwnProperty(destID) && (!sourceRecordRegistry.hasOwnProperty(destID) || !destRecordRegistry[destID])) destModel.deleteRow(destRecordRegistry[destID]);
	}
}

//Handle sourceRecordRegistry rows
for (var sourceID in sourceRecordRegistry) {
	if (!sourceRecordRegistry.hasOwnProperty(sourceID)) continue;

	//Rows in source that aren't in dest
	if (!destRecordRegistry.hasOwnProperty(sourceID)) {
		if (create) {
			for (var j = 0; j < iterations; j++) {
				destModel.createRow({
					doAppend: append,
					additionalConditions: buildAdditionalConditions(sourceRecordRegistry[sourceID], fieldMap)
				});
			}
		}
	} else {
		if (update) {
			destModel.updateRow(destRecordRegistry[sourceID], buildRow(sourceRecordRegistry[sourceID], fieldMap));
		}
	}
}

//Handle sourceRecordNew rows
if (create) {
	for (var j = 0; j < iterations; j++) {
		for (var i = 0; i < sourceRecordNew.length; i++) {
			var rowData = buildRow(sourceRecordNew[i], fieldMap, sourceModelIDField);
			destModel.updateRow(destModel.createRow({doAppend: append}), rowData);
		}
	}
}

return true;

//Check if the value evaluates to true and is also not the string value of "false". Useful for XML prop reading.
function trueish(value) {
	return value && (typeof value.toLowerCase == "undefined" || (value.toLowerCase() !== "false" && value !== "0"));
}

//This creates a list of fields common between the source and destination models, with a mapping between ID fields where supplied
function buildFieldMap(sourceModel, sourceIDField, destModel, destIDField, idOnly, excludes, includes) {
	if (!sourceModel || !destModel || !sourceModel.hasOwnProperty("fieldsMap") || !destModel.hasOwnProperty("fieldsMap")) {
		console.error("buildFieldMap() requires valid source and destination models");
		return 0;
	}

	if (!sourceModel.fieldsMap.hasOwnProperty(sourceIDField)) {
		console.error("Source ID Field not found in Source Model");
		return 0;
	}

	if (!destModel.fieldsMap.hasOwnProperty(destIDField)) {
		console.error("Destination ID Field not found in Destination Model");
		return 0;
	}

	excludes = excludes !== undefined ? excludes : [];
	includes = includes !== undefined ? includes : [];

	console.log("excludes", excludes);

	var result = {},
		sourceFields = Object.keys(sourceModel.fieldsMap);

	for (let i = 0; i < sourceFields.length; i++) {
		const sourceFieldName = sourceFields[i];

		if (sourceIDField) {
			if (sourceFieldName === sourceIDField) {
				if (!destModel.fieldsMap.hasOwnProperty(destIDField)) {
					console.error("Cannot find destination ID field " + destIDField);
					return false;
				}
				result[sourceIDField] = destIDField;
			} else if (!idOnly && excludes.indexOf(sourceFieldName) == -1) {
				if (destModel.fieldsMap.hasOwnProperty(sourceFieldName) && (includes.length == 0 || includes.indexOf(sourceFieldName) !== -1)) result[sourceFieldName] = sourceFieldName;
			}
		}
	}

	if (sourceModel.objectName && sourceModel.objectName !== destModel.objectName) {
		if (debugging) console.log("Dissimilar objects... removing recordtypes from fieldsMap");
		delete result.RecordType;
		delete result.RecordTypeId;
	}

	return result;
}

//Creates a row from the supplied source using fieldMap as a template for what row fields should be included and where
function buildRow(sourceRow, fieldMap, excludeID) {
	excludeID = excludeID === undefined ? false : excludeID;
	var result = {};
	for (var sourceField in fieldMap) {
		if (!fieldMap.hasOwnProperty(sourceField)) continue;
		if (sourceRow.hasOwnProperty(sourceField) && sourceField !== excludeID) {
			var destField = fieldMap[sourceField];
			result[destField] = sourceRow[sourceField];
		}
	}
	return result;
}

function buildAdditionalConditions(sourceRow, fieldMap, excludeID) {
	var row = buildRow(sourceRow, fieldMap, excludeID),
		result = [];

	for (var i in row) {
		if (!row.hasOwnProperty(i)) continue;
		result.push({"field": i, "value": row[i]});
	}
	return result;
}