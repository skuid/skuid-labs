//Assumes hh:mm:ss or mm:ss or ss
function TimeAdd(time1, time2) {
	time1 = time1.split(':');
	time2 = time2.split(':');
	var result = [],
		carry = 0;
	while(time1.length > 0 || time2.length > 0) {
  	var a = parseFloat(time1.pop()) || 0,
    	b = parseFloat(time2.pop()) || 0;
    var thisNum = ((a + b + carry) % 60).toString();
		result.push(thisNum.length == 1 ? "0" + thisNum : thisNum);
		carry = Math.floor((a + b + carry) / 60);
	}
	return result.reverse().join(':');
}
