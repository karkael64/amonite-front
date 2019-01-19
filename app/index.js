import Action from "./components/action";

window.addEventListener("load", function(){
  let a = new Action("Test", function(ev, btn) {
    setTimeout(function() {
      btn.rearm();
    }, 1000);
  });
  a.setContainer(document.body);
});
