define(['./util'], function() {
	return function(str, data, separator) {

		// replace spaces to `_` make it more easy to split words in a right form
		var arr = str.replace(/\s+/g, '_').split(/\b/),
			separatorReg = new RegExp('\\' + separator + '\+', 'g')

		// translating, yay!!!
		arr.forEach(function(item, i) {
			if (util.isChinese(item)) arr[i] = util.toLetter(item, data);
		})

		// consider that the `_` we have made
		return util.flatten(arr).join(separator).replace(/_/g, separator).replace(separatorReg, separator).toLowerCase();
	}
});