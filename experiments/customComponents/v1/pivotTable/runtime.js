(function (skuid) {

	var $ = skuid.$;

	skuid.componentType.register('pivot__pivottable', function (element, xmlDef) {

		var self = element;

		var modelName = xmlDef.attr('model'),
			columnFieldName = xmlDef.attr('columnField'),
			rowFieldName = xmlDef.attr('rowField'),
			aggFunctionName = xmlDef.attr('aggFunction'),
			valueFieldName = xmlDef.attr('valueField'),
			countFieldName = xmlDef.attr('countField'),
			showRowTotals = trueish(xmlDef.attr('showRowTotals')),
			showColumnTotals = trueish(xmlDef.attr('showColumnTotals')),
			roundTo = xmlDef.attr('roundField') && xmlDef.attr('roundField').replace(/\D-/g, ''),
			//TODO: Does Skuid have sanitization for this that we can use?
			tableId = xmlDef.attr('uniqueid'),
			tableClass = xmlDef.attr('cssclass');

		if (!modelName || !columnFieldName || !rowFieldName || !aggFunctionName) {
			self.text(
				'Error: Pivot table could not be drawn. ' +
				'A Model, Row Field, and Column Field must ALL be provided.'
			);
			return;
		}

		if (aggFunctionName !== "count" && !valueFieldName) {
			self.text(
				'Error: Pivot table could not be drawn. ' +
				'A Value field must be provided for any Aggregate function other than Count'
			);
			return;

		}

		self.model = skuid.$M(modelName);

		if (!self.model) {
			self.element.html(
				"<h1 style=\"font-color: red\">Invalid Model for Pivot Table component.</h1>"
			);
			return;
		}

		self.addClass("pivottable-content");

		self.draw = function () {
			var matrix = {},
				rowHeader = [],
				columnHeader = [],
				rowTotal = {},
				rowCounter = {},
				columnTotal = {},
				columnCounter = {},
				totalTotal = new PivotCell();
			$.each(self.model.data, function (i, row) {
				var rowID = self.model.getFieldValue(row, rowFieldName, true),
					columnID = self.model.getFieldValue(row, columnFieldName, true);

				if (!matrix.hasOwnProperty(rowID)) {
					matrix[rowID] = {};
					rowHeader.push(rowID);
					rowTotal[rowID] = new PivotCell();
					rowCounter[rowID] = new PivotCell();
				}
				if (!matrix[rowID].hasOwnProperty(columnID)) {
					matrix[rowID][columnID] = new PivotCell();
					if (columnHeader.indexOf(columnID) === -1) {
						columnHeader.push(columnID);
						columnTotal[columnID] = new PivotCell();
						columnCounter[columnID] = new PivotCell();
					}
				}

				var fieldValue = self.model.getFieldValue(row, valueFieldName, true),
					fieldObj = matrix[rowID][columnID],
					count = countFieldName ? self.model.getFieldValue(row, countFieldName, true) : 1;
				fieldObj.addValue(fieldValue, count);
				rowTotal[rowID].addValue(fieldValue, count);
				columnTotal[columnID].addValue(fieldValue, count);
				totalTotal.addValue(fieldValue, count);
			});

			//TODO: Sort by totals.
			switch (xmlDef.attr('rowSort')) {
				case 'titleasc':
					rowHeader.sort();
					break;
				case 'titledesc':
					rowHeader.sort().reverse();
					break;
				case 'totalasc':
					rowHeader.sort(function (a, b) {
						return rowTotal[a][aggFunctionName] - rowTotal[b][aggFunctionName];
					});
					break;
				case 'totaldesc':
					rowHeader.sort(function (a, b) {
						return rowTotal[b][aggFunctionName] - rowTotal[a][aggFunctionName];
					});
					break;
				default:
					break;
			}

			switch (xmlDef.attr('columnSort')) {
				case 'titleasc':
					columnHeader.sort();
					break;
				case 'titledesc':
					columnHeader.sort();
					columnHeader.reverse();
					break;
				case 'totalasc':
					columnHeader.sort(function (a, b) {
						return columnTotal[a][aggFunctionName] - columnTotal[b][aggFunctionName];
					});
					break;
				case 'totaldesc':
					columnHeader.sort(function (a, b) {
						return columnTotal[b][aggFunctionName] - columnTotal[a][aggFunctionName];
					});
					break;
				default:
					break;
			}

			self.component = $('<div>').addClass('nx-list nx-skootable-data');

			var table = $('<table>').addClass('nx-list nx-skootable-data').appendTo(self.component),
				thead = $('<thead>').addClass('pivotHead').appendTo(table),
				tr = $('<tr>').addClass('').appendTo(thead),
				value = 0;
			tr.append('<th>');
			for (var i = 0; i < columnHeader.length; i++)
				tr.append($('<th>' + columnHeader[i] + '</th>').addClass('pivotRow'));

			if (showRowTotals) tr.append($('<th>Total</th>').addClass('pivotRow'));


			var tbody = $('<tbody>').addClass('pivotBody').appendTo(table);
			for (var j = 0; j < rowHeader.length; j++) {
				var rowTitle = rowHeader[j],
					row = $('<tr>').addClass('pivotRow');
				row.append($('<td>' + rowHeader[j] + "</td>").addClass('pivotRowTitle'));
				for (i = 0; i < columnHeader.length; i++) {
					var columnTitle = columnHeader[i];
					//TODO: maybe add numeric type (percentage, currency, etc) awareness to the display. Propagate source field type?
					value = matrix[rowTitle][columnTitle] ? matrix[rowTitle][columnTitle][aggFunctionName] : 0;
					row.append($('<td>' + (!roundTo ? value : value.toFixed(roundTo)) + '</td>'));
				}
				if (showRowTotals) {
					value = rowTotal[rowHeader[j]][aggFunctionName];
					row.append($("<td>" + (!roundTo ? value : value.toFixed(roundTo)) + "</td>").addClass("pivotRowTotal"));
				}
				tbody.append(row);
			}

			if (showColumnTotals) {
				var foot = $('<tfoot>').addClass('pivotFoot').appendTo(table),
					footRow = $("<tr>").addClass('pivotRow pivotColumnTotal').appendTo(foot);
				footRow.append($("<td>Total</td>"));
				for (i = 0; i < columnHeader.length; i++) {
					value = columnTotal[columnHeader[i]][aggFunctionName];
					footRow.append($("<td>" + (!roundTo ? value : value.toFixed(roundTo)) + "</td>"));
				}
				if (showRowTotals)
					footRow.append($("<td>" + (!roundTo ? totalTotal[aggFunctionName]() : totalTotal[aggFunctionName]().toFixed(roundTo)) + "</td>").addClass("pivotRowTotal pivotTotalTotal"));
			}

			self.component.appendTo(self);
		};

		self.draw();
	});

	// Depends on ES6 being supported in the browser.
	function PivotCell() {
		this.count = 0;
		this.sum = 0;
		this.min = false;
		this.max = 0;
	}

	/**
	 * Returns the average of the pivot cell
	 * @return {number}
	 */
	PivotCell.prototype.average = function() {
		return this.sum / this.count;
	};

	PivotCell.prototype.addValue = function(value, count) {
		this.count += typeof count == 'undefined' ? 1 : count;
		this.sum += value;
		this.min = this.min === false || value < this.min ? value : this.min;
		this.max = value > this.max ? value : this.max;
	};

	// Check if the value evaluates to true and is also not the string value of "false". Useful for XML prop reading.
	function trueish(value) {
		return !!(value && (typeof value.toLowerCase == "undefined" || value.toLowerCase() !== "false"));
	}

})(skuid);