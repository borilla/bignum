var BigNum = (function() {

	function BigNum(num) {
		if (num instanceof BigNum) {
			this.digits = copyArray(num.digits);
			this.sign = num.sign;
		}
		else {
			var str = '' + num;
			if (str[0] == '-') {
				this.digits = strToDigits(str.slice(1));
				this.sign = -1;
			}
			else {
				this.digits = strToDigits(str);
				this.sign = 1;
			}
		}
	}

	BigNum.prototype.toString = function() {
		var str = digitsToStr(this.digits);
		return this.sign == 1 ? str : '-' + str;
	}

	BigNum.prototype.add = function(other) {
		other = ensureBigNum(other);
		if (this.sign == other.sign) {
			this.digits = addDigits(this.digits, other.digits);
		}
		else if (this.sign == 1) {
			var result = subtractDigits(this.digits, other.digits);
			this.digits = result.digits;
			this.sign = result.invert ? -1 : 1;
		}
		else {
			var result = subtractDigits(other.digits, this.digits);
			this.digits = result.digits;
			this.sign = result.invert ? -1 : 1;
		}
		return this;
	}

	BigNum.prototype.sub = function(other) {
		other = ensureBigNum(other);
		// temporarily invert sign of other number
		other.sign *= -1;
		this.add(other);
		other.sign *= -1;
		return this;
	}

	BigNum.prototype.mul = function(other) {
		other = ensureBigNum(other);
		var mem = buildMem(this);
		var totalDigits = [0];
		var zeros = [];
		var otherDigits = other.digits;
		for (var i = 0, l = otherDigits.length; i < l; ++i) {
			var otherDigit = otherDigits[i];
			totalDigits = addDigits(totalDigits, zeros.concat(mem[otherDigit]));
			zeros.push(0);
		}
		this.digits = totalDigits;
		this.sign = this.sign == other.sign ? 1 : -1;
		return this;
	}

	BigNum.prototype.pow = function(power) {
		if (power == 0) {
			this.digits = [1];
			this.sign = 1;
		}
		else {
			var temp = new BigNum(this);
			while (--power) {
				this.mul(temp);
			}
		}
		return this;
	}

	BigNum.add = function(num1, num2) {
		num1 = new BigNum(num1);
		num1.add(num2);
		return '' + num1;
	}

	BigNum.sub = function(num1, num2) {
		num1 = new BigNum(num1);
		num1.sub(num2);
		return '' + num1;
	}

	BigNum.mul = function(num1, num2) {
		num1 = new BigNum(num1);
		num1.mul(num2);
		return '' + num1;
	}

	BigNum.pow = function(num, power) {
		num = new BigNum(num);
		num.pow(power);
		return '' + num;
	}

	function ensureBigNum(x) {
		return x instanceof BigNum ? x : new BigNum(x);
	}

	function strToDigits(str) {
		return str.replace(/^0+/, '').split('').reverse().map(function(x) {
			return +x;
		});
	}

	function digitsToStr(digits) {
		var str = reverseArray(digits).join('').replace(/^0+/, '');
		return str ? str : '0';
	}

	function buildMem(num) {
		var digits = num.digits;
		var mem = [[0], digits];
		for (var i = 2; i < 10; ++i) {
			digits = addDigits(digits, num.digits);
			mem[i] = digits;
		}
		return mem;
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
			if (sum > 9) {
				sum -= 10;
				carry = 1;
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

	function subtractDigits(digits1, digits2) {
		var compare = compareDigits(digits1, digits2);
		if (compare == 0) {
			return {
				digits: [0],
				invert: false
			};
		}
		var invert = false;
		if (compare == -1) {
			invert = true;
			var tmp = digits2;
			digits2 = digits1;
			digits1 = tmp;
		}

		var result = [];
		var carry = 0;
		var length = Math.max(digits1.length, digits2.length);
		for (var i = 0; i < length; ++i) {
			var digit1 = digits1[i] || 0;
			var digit2 = digits2[i] || 0;
			var sum = digit1 - digit2 - carry;
			if (sum < 0) {
				sum += 10;
				carry = 1;
			}
			else {
				carry = 0;
			}
			result.push(sum);
		}
		return {
			digits: result,
			invert: invert
		};
	}

	function compareDigits(digits1, digits2) {
		var length1 = digits1.length;
		var length2 = digits2.length;
		if (length1 < length2) {
			return -1;
		}
		if (length1 > length2) {
			return 1;
		}
		for (var i = 0; i < length1; ++i) {
			var digit1 = digits1[i];
			var digit2 = digits2[i];
			if (digit1 < digits2) {
				return -1;
			}
			if (digit1 > digit2) {
				return 1;
			}
		}
		return 0;
	}

	function reverseArray(array) {
		var l = array.length;
		var a = Array(l);
		for (var i = 0, j = l - 1; i < l; ++i, --j) {
			a[i] = array[j];
		}
		return a;
	}

	function copyArray(array) {
		var l = array.length;
		var a = Array(l);
		for (var i = 0; i < l; ++i) {
			a[i] = array[i];
		}
		return a;
	}

	return BigNum;
}());
