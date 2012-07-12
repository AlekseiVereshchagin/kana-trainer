window.onload = function() {
	ui = new UserInteractor();
	ui.init(UserInteractor.get_options());
	document.getElementById('check_symbol').onkeypress = function(event) {
		ui.check_symbol_handler(event);
	}
	document.getElementById("check_symbol").focus();
	document.getElementById("interactor-options-save").onclick = function() {
		ui.save_options_handler();
	}
}
