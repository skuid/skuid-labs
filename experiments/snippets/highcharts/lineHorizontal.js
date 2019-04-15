/* 
    lineHorizontal.js - plots a horizontal line given a Y value.
    
    Boilerplate assumes you have the data you need in the first row of your Model.
    
    Peter K. (4/9/19)
*/

// Line Data
var VAR_MODEL = skuid.$M("YOUR_MODEL_HERE");
    VAR_VALUE = (VAR_MODEL.data.length > 0) ? VAR_MODEL.data[0]['YOUR_FIELD_HERE'] : "";
    
// Line Visual Options
var VAR_LINE_LABEL = "YOUR LABEL HERE",
    VAR_LINE_WIDTH = 2, // In px
    VAR_LINE_COLOR = "red",
    VAR_LINE_DASHSTYLE = 'shortdash'; // All styles: https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/

// Don't touch these. Jk, help yourself.
var chart = arguments[0],
	$ = skuid.$;

chart.yAxis[0].plotLines = [{
    value: VAR_VALUE,
    color: VAR_LINE_COLOR,
    dashStyle: VAR_LINE_DASHSTYLE,
    width: VAR_LINE_WIDTH,
    label: {
        text: VAR_LINE_LABEL
    },
    zIndex: 100
}];