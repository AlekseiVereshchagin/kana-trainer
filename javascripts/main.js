window.onload = function() {
	options = UserInteractor.get_options();
	if (options.autosave)
		ui = UserInteractor.load_cookie();
	if (!ui) {
		ui = new UserInteractor();
		ui.init(UserInteractor.get_options());
	}
	document.getElementById('check_symbol').onkeypress = function(event) {
		ui.check_symbol_handler(event);
	}
	document.getElementById("check_symbol").focus();
	document.getElementById("interactor-options-save").onclick = function() {
		ui.save_options_handler();
	}
	document.getElementById("interactor-restart").onclick = function() {
		ui.init(UserInteractor.get_options());
	}
}
