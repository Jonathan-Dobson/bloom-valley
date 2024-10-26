const cartDialog = document.querySelector("#cart-dialog");
const viewCartButton = document.querySelector("#view-cart");
const closeCartButton = document.querySelector("#cart-dialog > button");
const cartItemTemplate = document.getElementById("dialog-row-template");
const processOrderButton = document.querySelector("#submit-order");
currency = Intl.NumberFormat("en", {
  currency: "USD",
  style: "currency",
});

function disableButtons() {
  const submitButton = document.querySelector("#submit-order");
  submitButton.disabled = true;
  submitButton.textContent = "Cart is empty";
  // clearCartButton.style.cursor = "not-allowed";

  const clearCartButton = document.querySelector("#clear-cart");
  clearCartButton.disabled = true;
  clearCartButton.textContent = "Cart is empty";
  // clearCartButton.style.cursor = "not-allowed";
}

function enableButtons() {
  const submitButton = document.querySelector("#submit-order");
  submitButton.disabled = false;
  submitButton.textContent = "Submit Order";
  // clearCartButton.style.cursor = "pointer";

  const clearCartButton = document.querySelector("#clear-cart");
  clearCartButton.disabled = false;
  clearCartButton.textContent = "Clear Cart";
  // clearCartButton.style.cursor = "pointer";
}

// "Show the dialog" button opens the dialog modally
viewCartButton.addEventListener("click", async () => {
  const old = document.querySelector("#cart-dialog table tbody");
  old.remove();

  const container = document.querySelector("#cart-table");
  const table = document.createElement("tbody");

  cart = await getCartFromLocalStorage();

  if (cart.length > 0) {
    enableButtons();
    cart.forEach((product) => {
      const price = currency.format(product.price);
      const row = cartItemTemplate.cloneNode(true);
      row.id = product.id;
      row.querySelector(".remove-button").addEventListener("click", (event) => {
        event.preventDefault();
        const index = cart.findIndex((p) => p.id === product.id);
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        // remove row
        row.remove();
        const total = getCartTotal(cart);
        document.querySelector("#cart-total").textContent =
          currency.format(total);

        if (cart.length === 0) {
          disableButtons();
        }
      });
      row.querySelector(".dialog-name").textContent = product.name;
      row.querySelector(".dialog-price").textContent = price;
      table.appendChild(row);
    });
  } else {
    disableButtons();
  }

  container.appendChild(table);

  cartDialog.showModal();

  // if (cart.length > 0) {
  //   cart = [];
  //   localStorage.removeItem("cart");
  //   buildProductTable();
  // }

  // function buildProductTable() {
  //   if (!cart) return;
  //   const table = document.querySelector("#cart-dialog tbody");
  //   currency = Intl.NumberFormat("en", {
  //     currency: "USD",
  //     style: "currency",
  //   });
  //   table.innerHTML = "";
  //   cart.forEach((product) => {
  //     const row = document.createElement("tr");
  //     row.innerHTML = `
  //       <td>${product.name}</td>
  //       <td>${product.quantity}</td>
  //       <td>${currency.format(product.price)}</td>
  //     `;
  //     table.appendChild(row);
  //   });
  // }

  const total = getCartTotal(cart);
  document.querySelector("#cart-total").textContent = currency.format(total);
});

// calculate cart total price
function getCartTotal(cart) {
  return cart.reduce((total, product) => total + product.price, 0);
}

// "Close" button closes the dialog
closeCartButton.addEventListener("click", () => {
  cartDialog.close();
});

// show thank you message on submit
cartDialog.addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Thank you for your order.");
  cart = [];
  localStorage.removeItem("cart");
  const old = document.querySelector("#cart-dialog table tbody");
  old.remove();
  const total = getCartTotal(cart);
  document.querySelector("#cart-total").textContent = currency.format(total);
  const newTable = document.createElement("tbody");
  document.querySelector("#cart-dialog table").appendChild(newTable);

  cartDialog.close();
});

cartDialog.addEventListener("reset", async (event) => {
  // event.preventDefault();
  // alert("Your cart is now empty.");
  ok = confirm("Are you sure you want to empty your cart?");
  if (ok) {
    cart = [];
    localStorage.removeItem("cart");
    const old = document.querySelector("#cart-dialog table tbody");
    old.remove();
    const total = getCartTotal(cart);
    document.querySelector("#cart-total").textContent = currency.format(total);
    const newTable = document.createElement("tbody");
    document.querySelector("#cart-dialog table").appendChild(newTable);
    disableButtons();
  }
});

let products = [];

async function getProducts() {
  const category = getCategory();

  try {
    const response = await fetch("products.json");
    products = await response.json();

    if (category) {
      products = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    buildProductTable(products);
    return products;
  } catch (error) {
    console.error(error);
  }
}

async function getCartFromLocalStorage() {
  if (localStorage.getItem("cart")) {
    return JSON.parse(localStorage.getItem("cart"));
  }
  return [];
}

async function main() {
  products = await getProducts();

  // await getCartFromLocalStorage();
}

main();

// construct product table

function buildProductTable(products) {
  if (!products) return;
  const table = document.querySelector("#product-gallery tbody");

  products.forEach((product) => {
    const price = currency.format(product.price);

    const clone = document.getElementById("product-template").cloneNode(true);

    clone.id = product.id;
    clone.querySelector("img").src = product.img;
    clone.querySelector("img").alt = product.name;
    clone.querySelector(".name").textContent = product.name;
    clone.querySelector(".summary").textContent = product.summary;
    clone.querySelector(".price").textContent = price;
    clone.classList.add("red");

    clone
      .querySelector(".add-to-cart")
      .addEventListener("click", async (event) => {
        event.preventDefault();
        cart = await getCartFromLocalStorage();
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Added ${product.name} to cart`);
      });
    table.appendChild(clone);
  });
}

// get query from url
function getCategory() {
  const url = new URL(window.location.href);
  return url.searchParams.get("category");
}

// add the category chip to the dom
function addCategoryChip(category) {
  if (!category) return;
  const chip = document.createElement("div");
  chip.classList.add("chip");
  chip.textContent = category + " ✖️";

  chip.addEventListener("click", () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    window.location.href = url;
  });
  document.querySelector("#categories").appendChild(chip);
}

addCategoryChip(getCategory());
