const registerDialog = document.querySelector("#register-dialog");
const registerButton = document.querySelector("#register-button");
const closeRegistration = document.querySelector("#register-dialog > button");

// "Show the dialog" button opens the dialog modally
registerButton.addEventListener("click", () => {
  registerDialog.showModal();
});

// "Close" button closes the dialog
closeRegistration.addEventListener("click", () => {
  registerDialog.close();
});

// show thank you message on submit
registerDialog.addEventListener("submit", (event) => {
  event.preventDefault();
  alert(
    "Registration submitted! \nWelcome to the Bloom Valley Nursery Gardening Challenge! \nWe're thrilled to have you join us on this exciting journey! Our goal is to inspire and empower you to create a beautiful and thriving garden, while also connecting with other gardening enthusiasts in our community."
  );
  registerDialog.close();
});
