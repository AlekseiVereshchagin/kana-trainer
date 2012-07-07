window.onload = function() {
  UserInteractor.update();
  document.getElementById('check_symbol').onkeypress =
    UserInteractor.check_symbol_handler;
  document.getElementById("check_symbol").focus();
}
