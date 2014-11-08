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

	BigNum.prototype.sub = function(other) {
		this.str = BigNum.sub(this.str, other);
	}

	BigNum.prototype.mul = function(other) {
		this.str = BigNum.mul(this.str, other);
	}

	BigNum.prototype.pow = function(power) {
		this.str = BigNum.pow(this.str, power);
	}

	function strToDigits(str) {
		return str.toString().split('').reverse().map(function(x) {
			return +x;
		});
	}

	function digitsToStr(digits) {
		var str = digits.reverse().join('').replace(/^0+/, '');
		return str ? str : '0';
	}

	function addDigits(digits1, digits2) {
		var result = [];
		var l = Math.max(digits1.length, digits2.length);
		var limit = BigNum.limit;
		if (limit) {
			l = Math.min(l, limit);
		}
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

	function subtractDigits(digits1, digits2) {
		var result = [];
		var carry = 0;
		var l = Math.max(digits1.length, digits2.length);
		var limit = BigNum.limit;
		if (limit) {
			l = Math.min(l, limit);
		}
		for (var i = 0; i < l; ++i) {
			var digit1 = digits1[i] || 0;
			var digit2 = digits2[i] || 0;
			var sum = digit1 - digit2 + carry;
			if (sum < 0) {
				carry = -1;
				sum += 10;
			}
			else {
				carry = 0;
			}
			result.push(sum);
		}
		if (carry) {
			result.push(carry);
		}
		return result;
	}

	BigNum.add = function(num1, num2) {
		var digits1 = strToDigits(num1);
		var digits2 = strToDigits(num2);
		var result = addDigits(digits1, digits2);
		return digitsToStr(result);
	}

	BigNum.sub = function(num1, num2) {
		var digits1 = strToDigits(num1);
		var digits2 = strToDigits(num2);
		var result = subtractDigits(digits1, digits2);
		return digitsToStr(result);
	}

	function buildMem(num) {
		var mem = {
			'0': '0',
			'1': '' + num
		};
		var big = new BigNum(num);
		for (var i = 2; i < 10; ++i) {
			big.add(num);
			mem[i] = big.str;
		}
		return mem;
	}

	BigNum.mul = function(num1, num2) {
		var mem = buildMem(num1);
		var digits = strToDigits(num2);
		var total = new BigNum(0);
		var zeros = '';
		digits.forEach(function(digit, index) {
			var num = mem[digit] + zeros;
			total.add(num);
			zeros += '0';
		});
		return total.str;
	}

	BigNum.pow = function(num, power) {
		if (power == 0) {
			return '1';
		}
		// else
		var big = new BigNum(num);
		while (--power) {
			big.mul(num);
		}
		return big.str;
	}

	return BigNum;
}());
