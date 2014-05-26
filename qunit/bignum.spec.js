(function() {
	module('BigNum');

	QUnit.testStart(function() {
	});

	QUnit.testDone(function() {
	});

	test('should exist and be a function', function() {
		equal(typeof(BigNum), 'function', 'BigNum is a function');
	});

	test('should be able to initialise with a string', function() {
		var num = new BigNum('1234');
		equal(num.toString(), '1234', 'Can initialise with a string');
	});

	test('should be able to initialise with an integer', function() {
		var num = new BigNum(1234);
		equal(num.toString(), '1234', 'Can initialise with an integer');
	});

	test('should be able to initialise with another BigNum', function() {
		var num1 = new BigNum('1234');
		var num2 = new BigNum(num1);
		equal(num2.toString(), '1234', 'Can initialise with another BigNum');
	});

	test('should be able to add two numbers as strings', function() {
		function checkSum(num1, num2, expectedResult) {
			equal(BigNum.add(num1, num2), expectedResult, 'BigNum.add(\'' + num1 + '\', \'' + num2 + '\') = \'' + expectedResult + '\'');
		}
		checkSum('1', '1', '2');
		checkSum('5', '5', '10');
		checkSum('12345', '2', '12347');
		checkSum('0003', '2', '5');
	});

	test('should be able to add numbers instead of strings', function() {
		function checkSum(num1, num2, expectedResult) {
			equal(BigNum.add(num1, num2), expectedResult, 'BigNum.add(' + num1 + ', ' + num2 + ') = \'' + expectedResult + '\'');
		}
		checkSum(1, 1, '2');
		checkSum(5, 5, '10');
		checkSum(12345, 2, '12347');
		checkSum(0003, 2, '5');
	});

	test('should be able to multiply two numbers', function() {
		function checkMultiply(num1, num2, expectedResult) {
			equal(BigNum.mul(num1, num2), expectedResult, "BigNum.mul('" + num1 + "', '" + num2 + "') = " + expectedResult);
		}
		checkMultiply('123', '0', '0');
		checkMultiply('123', '1', '123');
		checkMultiply('123', '5', '615');
		checkMultiply('123', '9', '1107');
		checkMultiply('123', '10', '1230');
		checkMultiply('123', '123', '15129');
	});

	test('should be able to raise a number to specified power', function() {
		function checkPower(num, power, expectedResult) {
			equal(BigNum.pow(num, power), expectedResult, "BigNum.pow('" + num + "', " + power + ") = " + expectedResult);
		}
		checkPower('123', 0, '1');
		checkPower('123', 1, '123');
		checkPower('123', 2, '15129');
		checkPower('2', '8', '256');
	});
}());
