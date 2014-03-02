ig.module(
	'plugins.utils'
)
.defines(function() {

	'use strict';
	window.gg = window.gg || {};

	/*
	 * Helper function to test if a number lies within a given range.
	 */

	Number.prototype.between = function(a, b) {
		return (a <= this) && (this < b);
	};

	/*
	 * Return the first and last elements of an array if they exist, otherwise undefined.
	 */

	Array.prototype.first = function() {
		return this.length > 0 ? this[0] : undefined;
	};

	Array.prototype.last = function() {
		return this.length > 0 ? this[this.length - 1] : undefined;
	};

	/*
	 * Create a Utils class, primarily intended as a namespace for static functions.
	 */

	var Utils = ig.Class.extend({

		escapeRegExp: function(str) {
			if (str == null) return '';
			return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
		},

		defaultToWhiteSpace: function(characters) {
			if (characters == null)
				return '\\s';
			else if (characters.source)
				return characters.source;
			else
				return '[' + this.escapeRegExp(characters) + ']';
		},

		trim: function(str, characters) {
			if (str == null) return '';
			characters = this.defaultToWhiteSpace(characters);
			return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
		},

		ltrim:  function(str, characters) {
			if (str == null) return '';
			characters = this.defaultToWhiteSpace(characters);
			return String(str).replace(new RegExp('^' + characters + '+'), '');
		},

		rtrim: function(str, characters) {
			if (str == null) return '';
			characters = this.defaultToWhiteSpace(characters);
			return String(str).replace(new RegExp(characters + '+$'), '');
		},

		humanize: function(str) {
			str = this.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
			str = str.replace(/_id$/,'').replace(/_/g, ' ');
			return str.charAt(0).toUpperCase() + str.slice(1);
		},

		/*
		 * Formats a number based on the mask. We ignore everything left of the decimal
		 * point, but round off according to the decimal places.
		 */

		formatMasked: function(value, mask, trailingZeroes, thousandSeparator) {
			var maskParts = mask.split('.');
			var decimalPlaces = maskParts.length > 1 ? maskParts[1].length : 0;
			var result = value.toFixed(decimalPlaces);

			result = this.ltrim(result, '0');

			if (!trailingZeroes)
				result = this.rtrim(result, '0');

			var parts = result.split('.');
			if (parts[0].length === 0)
				parts[0] = '0';

			result =
				(thousandSeparator ? parts[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : parts[0]) +
				(parts[1] ? '.' + parts[1] : '');

			return result;
		},

		/*
		 * Generates a random number conforming to the given mask.
		 *
		 * A mask takes a form of ###.### where the hashes indicate the number of digits.
		 * If a digit appears instead of a hash, that exact digit must appear in the
		 * resulting number.
		 */

		randomMasked: function(mask, trailingZeroes, thousandSeparator) {
			var result = '';
			for (var i = 0; i < mask.length; i++) {
				var ch = mask.charAt(i);
				if (ch === '#')
					result += String(this.randomInRange(0, 10));
				else
					result += ch;
			}

			result = this.ltrim(result, '0');

			if (!trailingZeroes)
				result = this.rtrim(result, '0');

			var parts = result.split('.');
			if (parts[0].length === 0)
				parts[0] = '0';

			result =
				(thousandSeparator ? parts[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') : parts[0]) +
				(parts[1] ? '.' + parts[1] : '');

			return result;
		},

		/*
		 * Returns a random number >= lower and < upper.
		 */
		randomInRange: function(lower, upper) {
			return lower + Math.floor(Math.random() * (upper - lower));
		},

		/*
		 * Process an array representing a possible numbers and
		 * generate a random number from within it.
		 *
		 * The array can contain arrays that represent ranges of numbers, for example:
		 *
		 *   set = [1, 4, [6, 9], 12];
		 */

		randomInSet: function(set) {
			var indices = [];
			var availableNumbersCount = 0;

			for (var i = 0; i < set.length; i++) {
				var range = set[i];
				if (!Array.isArray(range))
					range = [range];

				// Report an error if the range is invalid, but try to continue with it anyway
				if (!range.length.between(1, 3))
					console.error('Invalid range in the set: ' + JSON.stringify(set));

				// Ignore any empty ranges
				if (range.length === 0)
					continue;

				indices.push(availableNumbersCount);
				availableNumbersCount += range.last() - range.first() + 1;
			}

			var index = this.randomInRange(0, availableNumbersCount);
			// Need to find the highest element <= index. A classic case for the C++ std::upper_bound but
			// Javascript doesn't seem to have one.
			for (var i = indices.length - 1; i >= 0; i--) {
				if (indices[i] <= index) {
					var range = set[i];
					if (!Array.isArray(range))
						range = [range];

					return this.randomInRange(range.first(), range.last());
				}
			}

			throw 'Failed to generate a number from the set: ' + JSON.stringify(set);
		},

		/*
		 * Returns whether a random probability occurred, such as '1/10'.
		 */

		randomChance: function(numerator, denominator) {
			return Math.floor(Math.random() * denominator) < numerator;
		},

		/*
		 * Permit C#-style string formatting, such as:
		 *   var message = gg.utils.format('Hello {0}!', yourName);
		 */

		format: function(string) {
			for (var i = 0; i < arguments.length - 1; i++) {
				var reg = new RegExp("\\{" + i + "\\}", "gm");
				string = string.replace(reg, arguments[i + 1]);
			}

			return string;
		},

		/*
		 * A collection of tweening functions. More can be found here: http://www.gizma.com/easing/
		 */

		tween: {
			linear: function(start, end, t, duration) {
				return (end - start) * t / duration + start;
			},

			quadraticInOut: function(start, end, t, duration) {
				t /= duration / 2;
				if (t < 1) return (end - start) / 2 * t * t + start;
				t--;
				return -(end - start) / 2 * (t * (t - 2) - 1) + start;
			}
		}
	});

	gg.utils = gg.utils || new Utils();
});
