function UserInteractor() {
}

UserInteractor.OptionValues = {
	Hiragana : [ '\u3042', '\u3044', '\u3046', '\u3048', '\u304A' ],
	Katakana : [ '\u30A1', '\u30A3', '\u30A5', '\u30A7', '\u30A9' ],
	Polivanov : [ 'а', 'и', 'у', 'э', 'о' ],
	Hepburn : [ 'a', 'i', 'u', 'e', 'o' ]
}

UserInteractor.get_options = function() {
	var options = {};
	var inputs = document.getElementById("interactor-options")
			.getElementsByTagName("input");
	var input;
	for ( var i = 0; i < inputs.length; i++) {
		input = inputs[i];
		if (input.type == "radio" && input.checked)
			options[input.name] = input.value;
	}
	return options;
}

UserInteractor.init = function(options) {
	this.Options = options;
	this.Tester = new AlphabetTester(
			this.OptionValues[this.Options.test_alphabet],
			this.OptionValues[this.Options.check_alphabet]);
	this.LearnedColor = {
		red : 102,
		green : 147,
		blue : 98
	};
	this.UnlearnedColor = {
		red : 220,
		green : 48,
		blue : 35
	};
	var open_symbols = document.getElementById("open_symbols");
	while (open_symbols.hasChildNodes()) {
		open_symbols.removeChild(open_symbols.lastChild);
	}
}

UserInteractor.update_test_symbol = function() {
	document.getElementById('test_symbol').textContent = this.TestSymbol;
}

UserInteractor.update_open_symbols = function() {
	var item_id = 'open_symbols[' + this.TestSymbolId + ']';
	var item = document.getElementById(item_id);
	if (item == null) {
		item = document.createElement("li");
		item.id = item_id;
		item.textContent = this.TestSymbol;

		document.getElementById('open_symbols').appendChild(item);
	}

	var level = this.Tester.LearningRate.get_value(this.TestSymbolId);
	var max = this.Tester.MaxLearningRate;
	var start = this.Tester.StartLearningRate;
	var min = this.Tester.MinLearningRate;
	if (level > start)
		var max_color = this.UnlearnedColor, k = (level - start)
				/ (max - start);
	else
		var max_color = this.LearnedColor, k = (start - level) / (start - min);
	var color = {
		red : Math.floor(max_color.red * k),
		green : Math.floor(max_color.green * k),
		blue : Math.floor(max_color.blue * k)
	};
	item.style.color = "rgb(" + color.red + "," + color.green + ","
			+ color.blue + ")";
}

UserInteractor.update = function() {
	this.TestSymbolId = this.Tester.get_random_learning_index();
	this.TestSymbol = this.Tester.TestAlphabet[this.TestSymbolId];
	this.CheckSymbol = this.Tester.CheckAlphabet[this.TestSymbolId];
	this.update_test_symbol();
	this.update_open_symbols();
}

UserInteractor.check_symbol_handler = function(event) {
	if (event.keyCode == 13 || event.which == 13) {
		var input_dom = document.getElementById("check_symbol");
		var test_symbol_dom = document.getElementById("test_symbol");
		var check_symbol = input_dom.value;
		var res = UserInteractor.Tester.test_and_update(
				UserInteractor.TestSymbol, check_symbol);
		test_symbol_dom.className += res ? " correct" : " uncorrect";
		input_dom.disabled = true;
		input_dom.value = UserInteractor.CheckSymbol;
		setTimeout(function() {
			test_symbol_dom.className = test_symbol_dom.className.replace(
					/(^|\s+)(correct|uncorrect)(?!\S)/, '');
			UserInteractor.update();
			input_dom.value = '';
			input_dom.disabled = false;
			input_dom.focus();
		}, 500);
	}
}

UserInteractor.save_options_handler = function() {
	UserInteractor.init(UserInteractor.get_options());
	UserInteractor.update();
}