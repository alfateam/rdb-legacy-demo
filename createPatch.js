let rfc = require('rfc6902');

module.exports = function createPatch(original, dto) {
	let clonedOriginal = toCompareObject(original);
	let clonedDto = toCompareObject(dto);
	let changes = rfc.createPatch(clonedOriginal, clonedDto);
	changes = changes.map(addOldValue);
	return changes;

	function addOldValue(change) {
		if (change.op !== 'replace')
			return change;

		function extract(obj, element) {
			return obj[element];
		}
		let splitPath = change.path.split('/');
		splitPath.shift();
		change.oldValue = splitPath.reduce(extract, clonedOriginal);
		return change;
	}

	function toCompareObject(object) {
		if (Array.isArray(object)) {
			let copy = {};
			for (var i = 0; i < object.length; i++) {
				let element = toCompareObject(object[i]);
				if (element === Object(element) && 'id' in element)
					copy[element.id] = element;
				else
					copy[i] = element;
			}
			return copy;
		} else if (object === Object(object)) {
			let copy = {};
			for (let name in object) {
				copy[name] = toCompareObject(object[name]);
			}
			return copy;
		}
		return object;
	}
}
