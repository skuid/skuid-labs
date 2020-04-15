# skuidCustom.js
This is a custom library allowing for function calls to the skuid.custom (eg. skuid.custom.modelLoader(model,params)). This library can be embedded as an In-line in the SKUID Editor, or as a Static Resource from Salesforce. Also adds functions helpful to working with Dates and Objects.

This library has been tested and is working with SKUID 12.1.7 and API v1.

## skuidCustom.js Functions

### Date.formatDate(date)
* date: a Javascript Date object

Takes a javascript date and returns a string in Salesforce date format "YYYY-MM-DD". Can also be used directly on a date object. (eg. d.formatDate();)

### Date.getDateFromSFDate(dateStr)
* dateStr: a salesforce formatted date string ("YYYY-MM-DD")

Takes a salesforce formatted date and returns a javascript date object.

### Date.isLeapYear(year)
* year: a year

Takes a year and returns true if it is a leap year, otherwise returns false. Can also be used on a javascript date directly and will return true if the year of that date is a leap year. (eg. d.isLeapYear();)

### Date.getDaysInMonth(year,month)
* year:  a year
* month:  a month

Takes a  year and a month and returns the number of days in that month. Can also be used on a javascript date directly and will return the number of days in the month of that date. (eg. d.getDaysInMonth();)

### Date.addMonths(months)
* months:  months to add to the given date.

Adds months to the given javascript date and returns a new javascript date with the months added (eg. d.addMonths(3);)

### Date.addDays(days)
* days: days to add to the given date.

Adds days to the given javascript date and returns a new javascript date with the days added (eg. d.addDays(3);)

### Object.byString(ourObject,fieldToGet)
* ourObject: object to get field from
* fieldToGet: field to get from object

Get field from an object. Allows for the field to be a subfield on a subobject. If fieldToGet = 'Field__r.OtherField__r.OtherOtherField__c', it will peroperly get the OtherOtherField__c using the single fieldToGet variable rather than needing 3 separate variables to get that field out from the sub-objects.

### skuid.custom.fixCurrency(number)
* number: any number

Javascript mathematical operations on floating point numbers can return your result but then also append an additional small value to the number due to "fuzzy math", eg. (1.020000000000000004 when the number should have been 1.02); this function will remove anything past 2 decimal places for the number and return the fixed number.

### skuid.custom.clearArray(array)
* array: an array

Force clears data from an array by popping any items that may still be on it.

### skuid.custom.operatorSOQL(operatorSafe)
* operatorSafe: String of an operator in an HTML/XML safe format (eg. "gte") to be converted

Converts a string for an operator from XML/HTML safe format to SOQL format (eg. "gte" converts to ">=") and returns the converted operator string.

### skuid.custom.operatorSafe(operatorSOQL)
**operatorSOQL:** String of an operator in SOQL format (eg. ">=") to be converted

Converts a string for an operator in SOQL format to HTML/XML safe format (eg. ">=" converts to "gte") and returns the converted operator string.

### skuid.custom.htmlEscape(string)
**string:** string to escape

HTML escapes a string. For use when creating XML to define template contents when creating a custom component via XML. Returns the HTML escaped string to be placed in the `<contents>` area of the XML defining the template field.

### skuid.custom.reRenderComponent(componentId)
* componentId: Id of a component on the page

Try to re-render a component, catches the error if the component cannot be re-rendered at this time.

### skuid.custom.waitForElement(fparams,callback)
* fparams = {
	* initEle: function to initialize the element / check if the element is initialized, should return the element. Takes context as a variable.
	* context:passed context or defaults to window
	* chunkTime: time between chunks, defaults to 250
 }
 * callback: function to run when the element is determined to be ready

Wait for an element to be ready on the screen before performing the callback function. Useful if needing to make a rendering update to an item on the screen but the item may not yet be fully rendered on the screen. This function will keep trying until the item is ready and then will call the callback function.

### skuid.custom.iterateArrayAsync(array, fn, chunkEndFn, endFn, maxTimePerChunk, context)
* array: array to iterate over
* fn: function to call on each iteration
* chunkEndFn: function to call whenever an asynchronous chunk completes (optional); parameters: row,length,percentDone
* endFn: function to call when the loop completes (optional)
* maxTimePerChunk: time between asynchronous chunks. (optional, default: 200)
* context: passed context (optional, default: window)

Iterate over an array asynchronously allowing for long loops to not freeze the browser tab. chunkEndFn can be used to update a loading message on the SKUID page.

If iterating over Model Rows, first get the rows into an array using model.getRows(), use that as the array variable.

**Usage**
```
iterateArrayAsync(ourArray,function(value, index, array){
	//runs each iteration of the loop
},
function(row,length,percentDone){
	//runs after every chunk completes, this is optional, use undefined if not using this
},
function(){
	//runs after completing the loop, this is optional, use undefined if not using this
	
});
```

### skuid.custom.iterateMapAsync(map, fn, chunkEndFn, endFn, maxTimePerChunk, context)
* map: map to iterate over
* fn: function to call on each iteration
* chunkEndFn: function to call whenever an asynchronous chunk completes (optional); parameters: row,length,percentDone
* endFn: function to call when the loop completes (optional)
* maxTimePerChunk: time between asynchronous chunks. (optional, default: 200)
* context: passed context (optional, default: window)

Iterate over a map (javascript map defined as Map()) asynchronously allowing for long loops to not freeze the browser tab. chunkEndFn can be used to update a loading message on the SKUID page.

**Usage**
```
iterateMapAsync(ourMap,function(value, key, map){
	//runs each iteration of the loop
},
function(index,length,percentDone){
	//runs after every chunk completes, this is optional, use undefined if not using this
},
function(){
	//runs after completing the loop, this is optional, use undefined if not using this
	
});
```

### skuid.custom.modelLoader(model,fparams)
* model: model to load
* fparams = {
    * limit: Number of rows to limit by. If unspecified will choose the model's recordsLimit property	or if that is unspecified defaults to 200
    * progressCallback: function to call before running each individual query in the format progressCallback(fparams), fparams is an object
        progressCallback fparams = {
            * count: count of rows queried so far
            * limit: our limit for how many rows to query per query run
            * nextStart: the row # of the next row to be queried,
            * nextEnd: the last row # to be queried (based on limit)
        }
    * exportWhenDone: true or false for whether or not to export when done loading, default false
    * exportOptions: options object to pass to the export function for customized options
}

Clear and Load all records in a model in chunks limited by the model's limit propery, a passed limit, or otherwise if both are undefined defaults to 200.

This will load all rows from the model's query in chunks, preventing APEX Heap Errors when querying too much data at once.

Model can be Basic or Aggregate, both will load in chunks limited by the limit.

Runs Asynchronously and works with $.when();

Will take into account any currently active/inactive filters on the model as well as sort order.

**NOTE:** Cannot use subquerying on aggregate models as we need to use OR to run more than one query and OR is not allowed along with subqueries in SOQL

**NOTE:** Uses direct SOQL queries. Operates faster than normal model.load(), but will use system permissions instead of user permissions to accomplish the querying, so the query will ignore the user's access to the object and assume system level access.

**Usage**
```
//Progress Callback function
let callback = function(fparams){
	var vm = skuid.$M('VariableModel');
	var vr = vm.getFirstRow();
	
    //Update variable model LoaderMsg with the progress of the loading
	vm.updateRow(vr,{
		LoaderMsg: 'Loading: '+fparams['nextStart']+'-'+fparams['nextEnd']
	});
}

//Call the model loader specifying our progress callback, a limit of 700 rows at a time, and we are specifying to export when done
$.when(skuid.custom.modelLoader(skuid.$M('OurModel'),{progressCallback: callback,limit:700,exportWhenDone: true})).done(function(){
	console.log('LOADING DONE');
	var vm = skuid.$M('Vars');
	var vr = vm.getFirstRow();

    //Update our variables model when done to indicate we've completed the query
	vm.updateRow(vr,{
		LoaderMsg: '',
		Done: true
	});
	
	console.log('MODELLOADER DONE');
});
```
