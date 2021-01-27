var input = document.querySelector("input[type=file]");
var text = document.querySelector("textarea");
var button = document.querySelector("input[type=button]");
var name;

input.onchange = function(e) {
  var reader = new FileReader();
  reader.onload = function(event) {
    text.value = event.target.result;
    button.disabled = false;
  }
  name = e.target.files[0].name;
  reader.readAsText(new Blob([e.target.files[0]], {
    "type": "application/json"
  }));
}

button.onclick = function(e) {
  e.preventDefault();
  var blob = new Blob([text.value], {
    "type": "application/json"
  });
  var a = document.createElement("a");
  a.download = name;
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  text.value = "";
  input.value = "";
  button.disabled = true;
  document.body.removeChild(a);
}
