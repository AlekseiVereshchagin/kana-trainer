function AlphabetTester(length) {
	if (length) {
		this.StartLearningRate = 11;
		this.MinLearningRate = 1;
		this.MaxLearningRate = 21;
		this.LearningRateDecrease = 1;
		this.LearningRateIncrease = 2;

		var learning_rate = new Array();
		this.Unlearned = new Array();
		for ( var i = 0; i < length; i++) {
			learning_rate[i] = 0;
			this.Unlearned[i] = i;
		}
		this.LearningRate = new SegmentTree(learning_rate);
		this.LearnedCount = 0;
		this.Level = 0;
		this.level_up();
	}
}

AlphabetTester.load_from_json = function(object) {
	var new_object = new AlphabetTester();
	new_object.StartLearningRate = object.StartLearningRate;
	new_object.MinLearningRate = object.MinLearningRate;
	new_object.MaxLearningRate = object.MaxLearningRate;
	new_object.LearningRateDecrease = object.LearningRateDecrease;
	new_object.LearningRateIncrease = object.LearningRateIncrease;
	new_object.Unlearned = object.Unlearned;
	new_object.LearningRate = SegmentTree.load_from_json(object.LearningRate);
	new_object.LearnedCount = object.LearnedCount;
	new_object.Level = object.Level;
	return new_object;
}

AlphabetTester.prototype.get_random_learning_index = function() {
	return this.LearningRate.prefix(Math.floor(Math.random()
			* this.LearningRate.sum()));
}

AlphabetTester.prototype.level_up = function() {
	if (this.Unlearned.length > 0) {
		this.Level++;
		var new_id = this.Unlearned.shift();
		this.LearningRate.set_value(new_id, this.StartLearningRate);
	}
}

AlphabetTester.prototype.level_down = function(sym_id) {
	if (this.Level > this.LearnedCount + 1) {
		this.Level--;
		this.Unlearned.unshift(sym_id);
		this.LearningRate.set_value(sym_id, 0);
	}
}

AlphabetTester.prototype.inc_learn_rate = function(sym_id, inc) {
	var v = this.LearningRate.get_value(sym_id), vn = v + inc;
	if (v == this.MinLearningRate && inc != 0)
		this.LearnedCount--;
	if (vn < this.MaxLearningRate)
		this.LearningRate.set_value(sym_id, vn);
	else if (v < this.MaxLearningRate) {
		this.LearningRate.set_value(sym_id, this.MaxLearningRate);
		this.level_down(sym_id);
	}
}

AlphabetTester.prototype.dec_learn_rate = function(sym_id, dec) {
	var v = this.LearningRate.get_value(sym_id), vn = v - dec;
	if (vn > this.MinLearningRate)
		this.LearningRate.set_value(sym_id, vn);
	else if (v > this.MinLearningRate) {
		this.LearningRate.set_value(sym_id, this.MinLearningRate);
		this.LearnedCount++;
		if (this.LearnedCount == this.Level)
			this.level_up();
	}
}

AlphabetTester.prototype.test_and_update = function(test_id, check_id) {
	var res = test_id == check_id;
	if (res)
		this.dec_learn_rate(test_id, this.LearningRateDecrease);
	else
		this.inc_learn_rate(test_id, this.LearningRateIncrease);
	return res;
}
