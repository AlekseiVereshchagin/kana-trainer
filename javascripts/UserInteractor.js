Hiragana = [
  '\u3042', '\u3044', '\u3046', '\u3048', '\u304A'
];

Romaji = [
  'a', 'i', 'u', 'e', 'o'
];

function UserInteractor() {}

UserInteractor.Tester = new AlphabetTester(Hiragana, Romaji);

UserInteractor.LearnedColor = {red: 0, green: 255, blue: 0};

UserInteractor.UnlearnedColor = {red: 255, green: 0, blue: 0};

UserInteractor.update_test_symbol = function() {
  document.getElementById('test_symbol').textContent = UserInteractor.TestSymbol;
}

UserInteractor.update_open_symbols = function() {
  var item_id = 'open_symbols[' + UserInteractor.TestSymbolId + ']',
      item = document.getElementById(item_id);
  if (item == null) {
    item = document.createElement("li");
    item.id = item_id;
    item.textContent = UserInteractor.TestSymbol;
    item.className += " open_symbols";
    
    document.getElementById('open_symbols').appendChild(item);
  }
  
  var level = UserInteractor.Tester.LearningRate.get_value(
      UserInteractor.TestSymbolId),
      max = UserInteractor.Tester.MaxLearningRate,
      start = UserInteractor.Tester.StartLearningRate,
      min = UserInteractor.Tester.MinLearningRate;
  if (level > start)
    var max_color = UserInteractor.UnlearnedColor,
        k = (level - start) / (max - start);
  else
    var max_color = UserInteractor.LearnedColor,
        k = (start - level) / (start - min);
  var color = {
        red: Math.floor(max_color.red * k),
        green: Math.floor(max_color.green * k),
        blue: Math.floor(max_color.blue * k)
      };
  item.style.color = "rgb(" +
    color.red + "," +
    color.green + "," +
    color.blue + ")";
}

UserInteractor.update = function() {
  UserInteractor.TestSymbolId = UserInteractor.Tester.get_random_learning_index();
  UserInteractor.TestSymbol = UserInteractor.Tester.TestAlphabet[
    UserInteractor.TestSymbolId];
  UserInteractor.CheckSymbol = UserInteractor.Tester.CheckAlphabet[
    UserInteractor.TestSymbolId];
  UserInteractor.update_test_symbol();
  UserInteractor.update_open_symbols();
}

UserInteractor.check_symbol_handler = function(event) {
  if (event.keyCode == 13 || event.which == 13) {
    var input_dom = document.getElementById("check_symbol"),
        test_symbol_dom = document.getElementById("test_symbol"),
        check_symbol = input_dom.value,
        res = UserInteractor.Tester.test_and_update(
          UserInteractor.TestSymbol, check_symbol);
    test_symbol_dom.className += res ? " correct" : " uncorrect";
    input_dom.disabled = true;
    input_dom.value = UserInteractor.CheckSymbol;
    setTimeout(
      function() {
        test_symbol_dom.className = test_symbol_dom.className.replace(
          /(^|\s+)(correct|uncorrect)(?!\S)/, '');
        UserInteractor.update();
        input_dom.value = '';
        input_dom.disabled = false;
        input_dom.focus();
      },
      500
    );
  }
}