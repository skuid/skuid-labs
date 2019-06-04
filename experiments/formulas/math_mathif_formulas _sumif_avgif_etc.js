// This was written for Skuid 11.X, and has not been tested in other version
// Only tested in Chrome on Win & Mac
// Uses 2 unsupported Skuid APIs (skuid.aggregations and skuid.utils.getObjectProperty)


// general function that does the 'if' in mathif to filter model to records where iffield=ifvalue
function mathAggIf(mathtype,modelname,fieldname,iffield,ifvalue,blanks){
    var modelrows = skuid.$M(modelname).getRows();
    function filterByField(item) {
        return (skuid.utils.getObjectProperty(item, iffield)===ifvalue) ? true : false; 
    }
    return skuid.aggregations.aggregate(mathtype,skuid.$M(modelname),fieldname, {countBlanks: blanks,rows: modelrows.filter(filterByField)}); // skuid function that takes in these params, passes to filter function, and spits out the result
}

// SUM & SUMIF
skuid.formula.Formula (
    'SUM',
    // MATH__SUM(modelToAgg,fieldToAgg,countblanks)  <- what to put in formula field, copy & paste in since can't add as choice from Function dropdown.
    function (modelname,fieldname,blanks) { 
        return skuid.aggregations.aggregate('sum',skuid.$M(modelname),fieldname, {countBlanks: blanks});
  },{
    namespace: 'MATH',
    numArgs : 3,
    returnType : 'string'
  }
);

skuid.formula.Formula (
    'SUMIF',
    // MATH__SUMIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
    function (modelname,fieldname,iffield,ifvalue,blanks) {
        return mathAggIf('sum',modelname,fieldname,iffield,ifvalue,blanks);
  },{
    namespace: 'MATH',
    numArgs : 5,
    returnType : 'string'
  }
);

// AVG & AVGIF
skuid.formula.Formula (
    'AVG',
    // MATH__AVG(modelToAgg,fieldToAgg,countblanks)
    function (modelname,fieldname,blanks) { 
        return skuid.aggregations.aggregate('avg',skuid.$M(modelname),fieldname, {countBlanks: blanks});
  },{
    namespace: 'MATH',
    numArgs : 3,
    returnType : 'string'
  }
);

skuid.formula.Formula (
    'AVGIF',
    // MATH_AVGIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
    function (modelname,fieldname,iffield,ifvalue,blanks) {
        return mathAggIf('avg',modelname,fieldname,iffield,ifvalue,blanks);
  },{
    namespace: 'MATH',
    numArgs : 5,
    returnType : 'string'
  }
);

// MIN & MINIF
skuid.formula.Formula (
    'MIN',
    // MATH__MIN(modelToAgg,fieldToAgg,countblanks)
    function (modelname,fieldname,blanks) { 
        return skuid.aggregations.aggregate('min',skuid.$M(modelname),fieldname, {countBlanks: blanks});
  },{
    namespace: 'MATH',
    numArgs : 3,
    returnType : 'string'
  }
);

skuid.formula.Formula (
    'MINIF',
    // MATH__MINIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
    function (modelname,fieldname,iffield,ifvalue,blanks) {
        return mathAggIf('min',modelname,fieldname,iffield,ifvalue,blanks);
  },{
    namespace: 'MATH',
    numArgs : 5,
    returnType : 'string'
  }
);

// MAX & MAXIF
skuid.formula.Formula (
    'MAX',
    // MATH__MAX(modelToAgg,fieldToAgg,countblanks)
    function (modelname,fieldname,blanks) { 
        return skuid.aggregations.aggregate('max',skuid.$M(modelname),fieldname, {countBlanks: blanks});
  },{
    namespace: 'MATH',
    numArgs : 3,
    returnType : 'string'
  }
);

skuid.formula.Formula (
    'MAXIF',
    // MATH__MAXIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
    function (modelname,fieldname,iffield,ifvalue,blanks) {
        return mathAggIf('max',modelname,fieldname,iffield,ifvalue,blanks);
  },{
    namespace: 'MATH',
    numArgs : 5,
    returnType : 'string'
  }
);

// COUNT&COUNTIF
skuid.formula.Formula (
    'COUNT',
    // MATH__COUNT(modelToAgg,fieldToAgg,countblanks)
    function (modelname,fieldname,blanks) { 
        return skuid.aggregations.aggregate('count',skuid.$M(modelname),fieldname, {countBlanks: blanks});
  },{
    namespace: 'MATH',
    numArgs : 3,
    returnType : 'string'
  }
);

skuid.formula.Formula (
    'COUNTIF',
    // MATH__COUNTIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
    function (modelname,fieldname,iffield,ifvalue,blanks) {
        return mathAggIf('count',modelname,fieldname,iffield,ifvalue,blanks);
  },{
    namespace: 'MATH',
    numArgs : 5,
    returnType : 'string'
  }
);

// MED & MEDIF
skuid.formula.Formula (
    'MED',
    // MATH__MED(modelToAgg,fieldToAgg,countblanks)
    function (modelname,fieldname,blanks) { 
        return skuid.aggregations.aggregate('med',skuid.$M(modelname),fieldname, {countBlanks: blanks});
  },{
    namespace: 'MATH',
    numArgs : 3,
    returnType : 'string'
  }
);

skuid.formula.Formula (
    'MEDIF',
    // MATH__MEDIF(modelToAgg,fieldToAgg,conditionField,conditionValue,countblanks)
    function (modelname,fieldname,iffield,ifvalue,blanks) {
        return mathAggIf('med',modelname,fieldname,iffield,ifvalue,blanks);
  },{
    namespace: 'MATH',
    numArgs : 5,
    returnType : 'string'
  }
);