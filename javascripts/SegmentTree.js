function SegmentTree(array) {
	if (array) {
		this.Nodes = new Array();

		var n = array.length, m = 1;
		while (m < n)
			m *= 2;

		this.Offset = m;

		if (n == 0)
			return;

		for ( var i = m; i < 2 * m; i++)
			this.Nodes[i - 1] = (i - m < array.length) ? array[i - m] : 0;
		while (m >= 2) {
			m >>= 1;
			for ( var i = 0; i < m; i++)
				this.Nodes[m + i - 1] = this.Nodes[(m + i) * 2 - 1]
						+ this.Nodes[(m + i) * 2];
		}
	}
}

SegmentTree.load_from_json = function(object) {
	var new_object = new SegmentTree();
	new_object.Nodes = object.Nodes;
	new_object.Offset = object.Offset;
	return new_object;
}

SegmentTree.prototype.get_value = function(i) {
	return this.Nodes[this.Offset + i - 1];
}

SegmentTree.prototype.set_value = function(i, v) {
	var m = this.Offset + i, dif = v - this.Nodes[m - 1];
	while (m > 0) {
		this.Nodes[m - 1] += dif;
		m >>= 1;
	}
}

SegmentTree.prototype.prefix = function(sum) {
	if (sum < 0 || sum > this.Nodes[0])
		return null;

	var i = 1, j, node_sum;
	while (i < this.Offset) {
		j = i * 2;
		node_sum = this.Nodes[j - 1];
		if (sum < node_sum && node_sum > 0)
			i = j;
		else {
			i = j + 1;
			sum -= node_sum;
		}
	}
	return i - this.Offset;
}

SegmentTree.prototype.sum = function() {
	return this.Nodes[0];
}
