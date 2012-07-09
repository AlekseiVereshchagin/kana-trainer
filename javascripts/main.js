window.onload = function() {
	UserInteractor.init(UserInteractor.get_options());
	UserInteractor.update();
	document.getElementById('check_symbol').onkeypress = UserInteractor.check_symbol_handler;
	document.getElementById("check_symbol").focus();
	document.getElementById("interactor-options-save").onclick = UserInteractor.save_options_handler;
}
