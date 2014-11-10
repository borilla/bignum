(function() {
	module('BigNum');

	QUnit.testStart(function() {
	});

	QUnit.testDone(function() {
	});

	test('should exist and be a function', function() {
		equal(typeof BigNum, 'function', 'BigNum is a function');
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

	test('should be able to initialise with a negative number', function() {
		var num1 = new BigNum('-1234');
		equal('' + num1, '-1234', 'Can initialise with a string')
		var num2 = new BigNum(num1);
		equal('' + num2, '-1234', 'Can initialise with another BigNum');
	});

	test('should be able to add two numbers', function() {
		function checkAdd(num1, num2, expectedResult) {
			equal(BigNum.add(num1, num2), expectedResult, 'BigNum.add(' + writeVar(num1) + ', ' + writeVar(num2) + ') == ' + writeVar(expectedResult));
		}
		checkAdd('1', '1', '2');
		checkAdd('5', '5', '10');
		checkAdd('12345', '2', '12347');
		checkAdd('0003', '2', '5');

		checkAdd(1, 1, '2');
		checkAdd(5, 5, '10');
		checkAdd(12345, 2, '12347');
		checkAdd(0003, 2, '5');

		checkAdd('-1', '-1', '-2');
		checkAdd('1', '-10', '-9');
		checkAdd('-5', '10', '5');
		checkAdd('-100', '-99', '-199');
	});

	test('should be able to subtract numbers', function() {
		function checkSubtract(num1, num2, expectedResult) {
			equal(BigNum.sub(num1, num2), expectedResult, 'BigNum.sub(' + writeVar(num1) + ', ' + writeVar(num2) + ') == ' + writeVar(expectedResult));
		}
		checkSubtract('1', '1', '0');
		checkSubtract('10', '5', '5');
		checkSubtract('1000', '999', '1');

		checkSubtract('1', '-1', '2');
		checkSubtract('-10', '-5', '-5');
		checkSubtract('-1000', '999', '-1999');
	});

	test('should be able to multiply two numbers', function() {
		function checkMultiply(num1, num2, expectedResult) {
			equal(BigNum.mul(num1, num2), expectedResult, 'BigNum.mul(' + writeVar(num1) + ', ' + writeVar(num2) + ') == ' + writeVar(expectedResult));
		}
		checkMultiply('123', '0', '0');
		checkMultiply('123', '1', '123');
		checkMultiply('123', '5', '615');
		checkMultiply('123', '9', '1107');
		checkMultiply('123', '10', '1230');
		checkMultiply('123', '123', '15129');

		checkMultiply('-123', '5', '-615');
		checkMultiply('123', '-5', '-615');
		checkMultiply('-123', '-5', '615');
	});

	test('should be able to raise a number to specified power', function() {
		function checkPower(num, power, expectedResult) {
			equal(BigNum.pow(num, power), expectedResult, 'BigNum.pow(' + writeVar(num) + ', ' + writeVar(power) + ') == ' + writeVar(expectedResult));
		}
		checkPower('123', 0, '1');
		checkPower('123', 1, '123');
		checkPower('123', 2, '15129');
		checkPower('2', '8', '256');
		checkPower('123456789012345678901234567890', 1, '123456789012345678901234567890');
		checkPower('-2', 2, '4');
		checkPower('-2', 3, '-8');
	});

	test('should be able to compare two numbers', function() {
		function checkCompare(num1, num2, expectedResult) {
			equal(BigNum.compare(num1, num2), expectedResult, 'BigNum.compare(' + writeVar(num1) + ', ' + writeVar(num2) + ') == ' + writeVar(expectedResult));
		}
		checkCompare('123', '19', '1');
		checkCompare('123', '123', '0');
		checkCompare('0', '123', '-1');
		checkCompare('0', '0', '0');

		checkCompare('123', '-123', '1');
		checkCompare('-123', '-123', '0');
		checkCompare('-123', '123', '-1');
	});

	test('should be able to divide a number', function() {
		function checkDivide(num1, num2, expectedResult) {
			equal(BigNum.div(num1, num2), expectedResult, 'BigNum.div(' + writeVar(num1) + ', ' + writeVar(num2) + ') == ' + writeVar(expectedResult));
		}
		checkDivide(256, 1, '256');
		checkDivide(256, 4, '64');
		checkDivide(-12, 3, '-4');
		checkDivide(12, -3, '-4');
		checkDivide(-12, -3, '4');

		checkDivide(12, 9, '1');
		checkDivide(12, 5, '2');
		checkDivide(10, 12, '0');
	});

	test('should be able to calculate remainder of a division (modulo)', function() {
		function checkModulo(num1, num2, expectedResult) {
			equal(BigNum.mod(num1, num2), expectedResult, 'BigNum.mod(' + writeVar(num1) + ', ' + writeVar(num2) + ') == ' + writeVar(expectedResult));
		}
		checkModulo(256, 4, '0');
		checkModulo(12, 9, '3');
		checkModulo(12, 5, '2');
		checkModulo(10, 12, '10');
		checkModulo(10, -12, '10');
		checkModulo(-10, 12, '-10');
		checkModulo(-10, -4, '-2');
		checkModulo(-10, 4, '-2');
	});

	test('should throw an exception if we try to divide by zero', function() {
		function divideByZero() {
			BivNum.div(1, 0);
		}
		function moduloByZero() {
			BivNum.mod(1, 0);
		}
		throws(divideByZero, Error, 'BivNum.div throws expected exception');
		throws(moduloByZero, Error, 'BivNum.mod throws expected exception');
	});

	function writeVar(p) {
		if (typeof p == 'string') {
			return "'" + p + "'";
		}
		return '' + p;
	}
}());
