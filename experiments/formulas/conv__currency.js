// convert currency between iso codes and output string[]

skuid.formula.Formula (
    'curr',
    
    function (amount,defaultiso,useriso,roundto) { 
        var convertedcurrency = skuid.utils.convertCurrency(amount,defaultiso,useriso);
        var roundby = roundto || 1;
        var roundedcurrency = Math.round(convertedcurrency/roundby) * roundby;
        var currobj = {recordCurrency: useriso};
        return skuid.currency.getDisplayValue(roundedcurrency, currobj);
  },{
    namespace: 'conv',
    numArgs : 4,
    returnType : 'string'
  }
);