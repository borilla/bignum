var BigNum = (function() {

	function BigNum(num) {
		this.str = num.toString();
	}

	BigNum.prototype.toString = function() {
		return this.str;
	}

	BigNum.prototype.add = function(other) {
		this.str = BigNum.add(this.str, other);
	}

	function strToDigits(str) {
		return str.toString().split('').reverse().map(function(x) {
			return +x;
		});
	}

	function digitsToStr(digits) {
		return digits.reverse().join('').replace(/^0+/, '');
	}

	function addDigits(digits1, digits2) {
		var result = [];
		var l = Math.max(digits1.length, digits2.length);
		var carry = 0;
		for (var i = 0; i < l; ++i) {
			var digit1 = digits1[i] || 0;
			var digit2 = digits2[i] || 0;
			var sum = digit1 + digit2 + carry;
			result.push(sum % 10);
			carry = (sum > 9) ? 1 : 0;
		}
		if (carry) {
			result.push(carry);
		}
		return result;
	}

	BigNum.add = function(num1, num2) {
		var digits1 = num1.digits || strToDigits(num1);
		var digits2 = num2.digits || strToDigits(num2);
		var result = addDigits(digits1, digits2);
		return digitsToStr(result);
	}

	return BigNum;
}());
