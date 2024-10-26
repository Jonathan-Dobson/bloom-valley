const dialog = document.querySelector("#subscribe-dialog");
const showButton = document.querySelector("#subcribe");
const closeButton = document.querySelector("#subscribe-dialog > button");

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});

// show thank you message on submit
dialog.addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Thank you for subscribing!");
  dialog.close();
});
