function UserInteractor() {
	if (!UserInteractor.__instance)
		UserInteractor.__instance = this;
	else
		return UserInteractor.__instance;
}

UserInteractor.OptionValues = {
	Hiragana : [ '\u3042', '\u3044', '\u3046', '\u3048', '\u304A', '\u304B',
			'\u304D', '\u304F', '\u3051', '\u3053', '\u3055', '\u3057',
			'\u3059', '\u305B', '\u305D', '\u305F', '\u3061', '\u3064',
			'\u3066', '\u3068', '\u306A', '\u306B', '\u306C', '\u306D',
			'\u306E', '\u306F', '\u3072', '\u3075', '\u3078', '\u307B',
			'\u307E', '\u307F', '\u3080', '\u3081', '\u3082', '\u3084',
			'\u3086', '\u3088', '\u3089', '\u308A', '\u308B', '\u308C',
			'\u308D', '\u308F', '\u3092', '\u3093' ],
	Katakana : [ '\u30A2', '\u30A4', '\u30A6', '\u30A8', '\u30AA', '\u30AB',
			'\u30AD', '\u30AF', '\u30B1', '\u30B3', '\u30B5', '\u30B7',
			'\u30B9', '\u30BB', '\u30BD', '\u30BF', '\u30C1', '\u30C4',
			'\u30C6', '\u30C8', '\u30CA', '\u30CB', '\u30CC', '\u30CD',
			'\u30CE', '\u30CF', '\u30D2', '\u30D5', '\u30D8', '\u30DB',
			'\u30DE', '\u30DF', '\u30E0', '\u30E1', '\u30E2', '\u30E4',
			'\u30E6', '\u30E8', '\u30E9', '\u30EA', '\u30EB', '\u30EC',
			'\u30ED', '\u30EF', '\u30F2', '\u30F3' ],
	Polivanov : [ 'а', 'и', 'у', 'э', 'о', 'ка', 'ки', 'ку', 'кэ', 'ко', 'са',
			'си', 'су', 'сэ', 'со', 'та', 'ти', 'цу', 'тэ', 'то', 'на', 'ни',
			'ну', 'нэ', 'но', 'ха', 'хи', 'фу', 'хэ', 'хо', 'ма', 'ми', 'му',
			'мэ', 'мо', 'я', 'ю', 'ё', 'ра', 'ри', 'ру', 'рэ', 'ро', 'ва',
			'во', 'н' ],
	Hepburn : [ 'a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko', 'sa',
			'shi', 'su', 'se', 'so', 'ta', 'chu', 'tsu', 'te', 'to', 'na',
			'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho', 'ma', 'mi',
			'mu', 'me', 'mo', 'ya', 'yu', 'yo', 'ra', 'ri', 'ru', 're', 'ro',
			'wa', 'wo', 'n' ]
}

UserInteractor.LearnedColor = {
	red : 102,
	green : 147,
	blue : 98
};
UserInteractor.UnlearnedColor = {
	red : 220,
	green : 48,
	blue : 35
};

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

UserInteractor.set_options = function(options) {
	var inputs = document.getElementById("interactor-options")
			.getElementsByTagName("input");
	var input;
	for ( var i = 0; i < inputs.length; i++) {
		input = inputs[i];
		if (input.type == "radio" && input.value == options[input.name])
			input.checked = true;
	}
}

UserInteractor.clean_open_symbols = function() {
	var open_symbols = document.getElementById("open_symbols");
	while (open_symbols.hasChildNodes()) {
		open_symbols.removeChild(open_symbols.lastChild);
	}
}

UserInteractor.load_from_json = function(object) {
	var new_object = new UserInteractor();
	new_object.Options = object.Options;
	new_object.Tester = AlphabetTester.load_from_json(object.Tester);
	new_object.TestSymbolId = object.TestSymbolId;
	new_object.constructor.set_options(new_object.Options);
	new_object.update_test_symbol(new_object.TestSymbolId);
	new_object.open_symbols_rebuild();
	return new_object;
}

UserInteractor.load_cookie = function() {
	var val = Cookie.get("UserInteractor");
	if (val)
		this.load_from_json(JSON.parse(val));
}

UserInteractor.prototype.init = function(options) {
	this.Options = options;
	this.Tester = new AlphabetTester(this.get_option("test_alphabet").length);
	this.constructor.clean_open_symbols();
	this.update();
}

UserInteractor.prototype.save_cookie = function(expires) {
	if (!expires) {
		expires = new Date();
		expires.setMonth(expires.getMonth() + 1);
	}
	Cookie.set("UserInteractor", JSON.stringify(this), {expires: expires});
}

UserInteractor.prototype.get_option = function(option_name) {
	return this.constructor.OptionValues[this.Options[option_name]];
}

UserInteractor.prototype.get_test_symbol = function(test_symbol_id) {
	return this.get_option("test_alphabet")[test_symbol_id];
}
UserInteractor.prototype.get_correct_check_symbol = function(test_symbol_id) {
	return this.get_option("check_alphabet")[test_symbol_id];
}

UserInteractor.prototype.get_check_symbol_id = function(check_symbol) {
	return this.get_option("check_alphabet").indexOf(check_symbol);
}

UserInteractor.prototype.update_test_symbol = function(symbol_id) {
	document.getElementById("test_symbol").textContent = this
			.get_test_symbol(symbol_id);
}

UserInteractor.prototype.update_open_symbol = function(symbol_id) {
	var item_id = "open_symbols[" + symbol_id + "]";
	var item = document.getElementById(item_id);
	if (item == null) {
		item = document.createElement("li");
		item.id = item_id;
		item.textContent = this.get_test_symbol(symbol_id);

		document.getElementById("open_symbols").appendChild(item);
	}

	var level = this.Tester.LearningRate.get_value(symbol_id);
	var max = this.Tester.MaxLearningRate;
	var start = this.Tester.StartLearningRate;
	var min = this.Tester.MinLearningRate;
	if (level > start)
		var max_color = this.constructor.UnlearnedColor, k = (level - start)
				/ (max - start);
	else
		var max_color = this.constructor.LearnedColor, k = (start - level)
				/ (start - min);
	var color = {
		red : Math.floor(max_color.red * k),
		green : Math.floor(max_color.green * k),
		blue : Math.floor(max_color.blue * k)
	};
	item.style.color = "rgb(" + color.red + "," + color.green + ","
			+ color.blue + ")";
}

UserInteractor.prototype.update = function() {
	this.TestSymbolId = this.Tester.get_random_learning_index();
	// this.TestSymbol = this.get_option("test_alphabet")[this.TestSymbolId];
	// this.CheckSymbol = this.Tester.CheckAlphabet[this.TestSymbolId];
	this.update_test_symbol(this.TestSymbolId);
	this.update_open_symbol(this.TestSymbolId);
}

UserInteractor.prototype.open_symbols_rebuild = function() {
	this.constructor.clean_open_symbols();
	for ( var i = 0; i < this.get_option("test_alphabet").length; i++)
		if (this.Tester.LearningRate.get_value(i) > 0)
			this.update_open_symbol(i);
}

UserInteractor.prototype.check_symbol_handler = function(event) {
	if (event.keyCode == 13 || event.which == 13) {
		var input_dom = document.getElementById("check_symbol");
		var test_symbol_dom = document.getElementById("test_symbol");
		var check_symbol = input_dom.value;
		var res = this.Tester.test_and_update(this.TestSymbolId, this
				.get_check_symbol_id(check_symbol));
		test_symbol_dom.className += res ? " correct" : " uncorrect";
		input_dom.disabled = true;
		input_dom.value = this.get_correct_check_symbol(this.TestSymbolId);

		var that = this;
		setTimeout(function() {
			test_symbol_dom.className = test_symbol_dom.className.replace(
					/(^|\s+)(correct|uncorrect)(?!\S)/, "");
			that.update();
			input_dom.value = "";
			input_dom.disabled = false;
			input_dom.focus();
		}, 500);
	}
}

UserInteractor.prototype.save_options_handler = function() {
	this.init(this.constructor.get_options());
}
