var BigNum = (function() {

	function BigNum(num) {
		if (!num) {
			zero(this);
		}
		else if (num instanceof BigNum) {
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
		// if signs are the same then simply add the digits
		if (this.sign == other.sign) {
			this.digits = addDigits(this.digits, other.digits);
			// sign remains the same
			return this;
		}
		// else, if numbers are equal but opposite, result is zero
		var compare = compareDigits(this.digits, other.digits);
		if (compare == 0) {
			return zero(this);
		}
		// else, if this number is greater than the other
		if (compare == 1) {
			this.digits = subtractDigits(this.digits, other.digits);
			// sign remains the same
			return this;
		}
		// else, the other number is greater than this one
		this.digits = subtractDigits(other.digits, this.digits);
		// invert the sign
		this.sign *= -1;
		return this;
	}

	BigNum.prototype.sub = function(other) {
		other = ensureBigNum(other);
		// temporarily invert sign of other number and add it
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

	BigNum.prototype.compare = function(other) {
		other = ensureBigNum(other);
		if (this.sign != other.sign) {
			return this.sign;
		}
		// else
		if (this.sign == 1) {
			return compareDigits(this.digits, other.digits);
		}
		// else
		return compareDigits(other.digits, this.digits);
	}

	BigNum.prototype.gt = function(other) {
		return this.compare(other) == 1;
	}

	BigNum.prototype.lt = function(other) {
		return this.compare(other) == -1;
	}

	BigNum.prototype.eq = function(other) {
		return this.compare(other) == 0;
	}

	BigNum.prototype.div = function(other) {
		var result = BigNum.divMod(this, other);
		this.digits = result.div.digits;
		this.sign = result.div.sign;
		return this;
	}

	BigNum.prototype.mod = function(other) {
		var result = BigNum.divMod(this, other);
		this.digits = result.mod.digits;
		this.sign = result.mod.sign;
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

	BigNum.prototype.isZero = function() {
		return isZero(this.digits);
	}

	BigNum.compare = function(num1, num2) {
		num1 = ensureBigNum(num1);
		return num1.compare(num2);
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

	BigNum.div = function(num1, num2) {
		var result = BigNum.divMod(num1, num2);
		return '' + result.div;
	}

	BigNum.mod = function(num1, num2) {
		var result = BigNum.divMod(num1, num2);
		return '' + result.mod;
	}

	BigNum.divMod = function(num1, num2) {
		var total = new BigNum(num1);
		var divisor = new BigNum(num2);
		if (isZero(divisor)) {
			throw 'divide by zero';
		}
		var divisorDigits = divisor.digits;
		var result = new BigNum();
		var resultDigits = result.digits = [];
		result.sign = divisor.sign == total.sign ? 1 : -1;

		var zeros = total.digits.length - divisorDigits.length;
		for (var i = 0; i < zeros; ++i) {
			divisorDigits.unshift(0);
		}
		for (var i = -1; i < zeros; ++i) {
			var digit = 0;
			var compare;
			while ((compare = compareDigits(total.digits, divisorDigits)) != -1) {
				++digit;
				if (compare == 0) {
					zero(total);
					break;
				}
				// else
				total.digits = subtractDigits(total.digits, divisorDigits);
			}
			resultDigits.unshift(digit);
			if (compare == 0) {
				break;
			}
			divisorDigits.shift();
		}
		trimTrailingZeros(resultDigits);
		return {
			div: result,
			mod: total
		};
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
		var str = reverseArray(digits).join('');
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
		trimTrailingZeros(result);
		return result;
	}

	function isZero(digits) {
		digits = digits.digits || digits;
		return digits.length == 1 && digits[0] == 0;
	}

	function zero(big) {
		big.digits = [0];
		big.sign = 1;
		return big;
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
		for (var i = length1 - 1; i >= 0; --i) {
			var digit1 = digits1[i];
			var digit2 = digits2[i];
			if (digit1 < digit2) {
				return -1;
			}
			if (digit1 > digit2) {
				return 1;
			}
		}
		return 0;
	}

	function trimTrailingZeros(digits) {
		var length = digits.length;
		while (digits[--length] == 0);
		digits.length = length + 1;
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
