"use strict";

const products = [
  {
    index: 1,
    id: "p1",
    name: "Samsung TV",
    price: 500000,
  },
  {
    index: 2,
    id: "p2",
    name: "Pixel 4a",
    price: 250000,
  },
  {
    index: 3,
    id: "p3",
    name: "PS 5",
    price: 300000,
  },
  {
    index: 4,
    id: "p4",
    name: "MacBook Air",
    price: 800000,
  },
  {
    index: 5,
    id: "p5",
    name: "Apple Watch",
    price: 95000,
  },
  {
    index: 6,
    id: "p6",
    name: "Air Pods",
    price: 75000,
  },
];
let cartList = [];
let saved;
const header = document.querySelector("header");
const intro = document.querySelector(".intro");
const headerHeight = header.getBoundingClientRect().height;
// console.log(headerHeight);
const continueShopping = document.querySelector(".continue");
const cartContainer = document.querySelector(".cart_container");
const modalOverlay = document.querySelector(".modal_overlay");
const shoppingModal = document.querySelector(".shopping_cart");
const Error1 = document.querySelector(".error1");
const Error2 = document.querySelector(".error2");
const Error3 = document.querySelector(".error3");
const nameField = document.querySelector("#name");
const email = document.querySelector("#email");
const tel = document.querySelector("#tel");
const checkout = document.querySelector(".checkout");
const shopSection = document.querySelector(".shop");
const itemNo = document.querySelector(".item_no");
const cartTable = document.querySelector(".cart-table");
const totalAmount = document.querySelector(".total-amount");
const minReached = document.querySelector(".min-reached");
const summary = document.querySelector(".summary");
const summaryBtn = document.querySelector(".ok");

// STICKY HEADER IMPLEMENTATION
const nav = function (entries) {
  const [entry] = entries;
  //   console.log(entry);
  if (!entry.isIntersecting) header.classList.add("header_sticky");
  else header.classList.remove("header_sticky");
};
const headerObserver = new IntersectionObserver(nav, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});
headerObserver.observe(intro);

// FUNCTIONS
const removeDisplay = function (button) {
  button.style.backgroundColor = "#ffe9d6";
  button.textContent = "remove from cart";
  button.classList.toggle("btn-add");
};
const addDisplay = function (button) {
  button.style.backgroundColor = "#ff9a3d";
  button.textContent = "add to cart";
  button.classList.toggle("btn-add");
};
const updateCartItemsNo = function () {
  itemNo.textContent = cartList.length;
};
// SHOP SECTION
shopSection.addEventListener("click", function (e) {
  if (!e.target.closest(".items")) return;
  const index = e.target.closest(".items").dataset.index;

  if (e.target.classList.contains("btn")) {
    //clicks add to cart button
    if (e.target.classList.contains("btn-add")) {
      //update the button display
      removeDisplay(e.target);
      //add to cart list
      cartList.push({ ...products[index - 1], quantity: 1 });
      //update cart length
      updateCartItemsNo();
      //save to localstorage
      setLocalStorage();
    } else {
      //clicks remove from cart button
      //update the button display
      addDisplay(e.target);
      //remove from cart list
      cartList = cartList.filter((ev) => ev.index != index);
      //update cart length
      updateCartItemsNo();
      //save to localstorage
      setLocalStorage();
    }
  }
});

//SHOPPING CART MODAL
function renderCartTable() {
  cartTable.innerHTML = "";
  if (cartList.length == 0) {
    const html = `
    <tr>
            <td colspan="5">No item found in your cart.</td>
          </tr>`;
    cartTable.insertAdjacentHTML("afterbegin", html);
  } else {
    const html = cartList
      .map(
        (ev, i) => `
  <tr class="${i % 2 != 0 ? "even" : " "}" data-cartIndex = ${ev.index}>
  <td>${i + 1}</td>
  <td>${ev.name}</td>
  <td>&#8358; ${ev.price.toLocaleString()}</td>
  <td>
    <i class="fas fa-minus-circle minus-sign ${
      ev.quantity > 1 ? "" : "min-reached"
    }"></i>
    <span>${ev.quantity}</span>
    <i class="fas fa-plus-circle plus-sign "></i>
  </td>
  <td><button class= 'remove'>remove</button></td>
</tr>
  `
      )
      .join("");
    cartTable.insertAdjacentHTML("afterbegin", html);
  }
}
function renderTotalAmount() {
  totalAmount.textContent = "";
  const balance = cartList.reduce(
    (curr, ev) => curr + ev.price * ev.quantity,
    0
  );
  totalAmount.innerHTML = `&#8358; ${balance.toLocaleString()}`;
  return balance;
}
cartContainer.addEventListener("click", function () {
  //clicks cart icon
  //Makes the modal a bit  responsive
  if (cartList.length > 3) {
    shoppingModal.style.position = "absolute";
  } else {
    shoppingModal.style.position = "fixed";
  }
  //show the shopping modal and overlay
  shoppingModal.classList.remove("hidden");
  modalOverlay.classList.remove("hidden");
  renderCartTable();
  renderTotalAmount();
});
cartTable.addEventListener("click", function (e) {
  //cart table
  const cartIndex = e.target.closest("tr").dataset.cartindex;
  //increase quantity
  if (e.target.classList.contains("plus-sign")) {
    cartList.forEach((ev) => (ev.index == cartIndex ? (ev.quantity += 1) : ""));
  }
  //decrease quantity
  if (e.target.classList.contains("minus-sign")) {
    cartList.forEach((ev) => (ev.index == cartIndex ? (ev.quantity -= 1) : ""));
  }
  //removal
  if (e.target.classList.contains("remove")) {
    cartList = cartList.filter((ev) => ev.index != cartIndex);
    //update button display of the shop section
    shopSection.querySelectorAll(".items").forEach(function (ev) {
      if (ev.dataset.index == cartIndex) {
        const btn = ev.querySelector("button");
        addDisplay(btn);
      }
    });
    //update cart length
    updateCartItemsNo();
  }
  //
  setLocalStorage();
  renderCartTable();
  renderTotalAmount();
});

// FORM VALIDATION
const clearField = function (fieldName, ErrorNo) {
  fieldName.value = "";
  fieldName.style.border = "";
  ErrorNo.textContent = "";
};
function nameValidation() {
  if (nameField.value == "") {
    nameField.style.marginBottom = "0";
    nameField.style.border = "1px solid red";
    Error1.textContent = "please enter your name";
  } else if (Number(nameField.value)) {
    nameField.style.marginBottom = "0";
    nameField.style.border = "1px solid red";
    Error1.textContent = "invalid name";
  } else {
    saved = nameField.value;
    nameField.style.border = "1px solid green";
    Error1.textContent = "";
    return true;
  }
}
function emailValidation() {
  if (email.value == "") {
    email.style.marginBottom = "0";
    email.style.border = "1px solid red";
    Error2.textContent = "please enter your email";
  } else if (!email.value.includes("@")) {
    email.style.marginBottom = "0";
    email.style.border = "1px solid red";
    Error2.textContent = "invalid email";
  } else {
    email.style.border = "1px solid green";
    Error2.textContent = "";
    return true;
  }
}
function telValidation() {
  if (tel.value == "") {
    tel.style.marginBottom = "0";
    tel.style.border = "1px solid red";
    Error3.textContent = "please enter your phone number";
  } else if (!Number(tel.value)) {
    tel.style.marginBottom = "0";
    tel.style.border = "1px solid red";
    Error3.textContent = "invalid phone number";
  } else if (tel.value.length < 11) {
    tel.style.marginBottom = "0";
    tel.style.border = "1px solid red";
    Error3.textContent = "phone number can not be less than 11 characters";
  } else {
    tel.style.border = "1px solid green";
    Error3.textContent = "";
    return true;
  }
}
nameField.addEventListener("blur", nameValidation);
email.addEventListener("blur", emailValidation);
tel.addEventListener("blur", telValidation);
nameField.addEventListener("focus", function () {
  clearField(nameField, Error1);
});
email.addEventListener("focus", function () {
  clearField(email, Error2);
});
tel.addEventListener("focus", function () {
  clearField(tel, Error3);
});
// FUNCTION
const addHidden = function () {
  shoppingModal.classList.add("hidden");
  modalOverlay.classList.add("hidden");
  //clear all the input fields
  nameField.value = "";
  email.value = "";
  tel.value = "";
  nameField.style.border = "";
  email.style.border = "";
  tel.style.border = "";
  Error1.textContent = "";
  Error2.textContent = "";
  Error3.textContent = "";
};
function showSummary() {
  summary.classList.toggle("hidden");
  summary.querySelector("tbody").innerHTML = "";
  summary.querySelector(".saved").textContent = saved;
  const html = cartList.map(
    (ev, i) => `
        <tbody>
          <tr class="${i % 2 != 0 ? "even" : " "}">
            <td>${i + 1}</td>
            <td>${ev.name}</td>
            <td>
              <span>${ev.quantity}</span>
            </td>
          </tr>
        </tbody>
  
  `
  );
  summary.querySelector("tbody").insertAdjacentHTML("afterbegin", html);
}
const payWithPaystack = function () {
  let handler = PaystackPop.setup({
    key: "pk_test_7c22b99ee1892e038577e10159c92c3e84598e84", // Replace with your public key
    email: email.value,
    amount: renderTotalAmount() * 100,
    ref: "" + Math.floor(Math.random() * 1000000000 + 1),
    onClose: function () {
      alert("Window closed.");
    },
    callback: function () {
      showSummary();
    },
  });
  handler.openIframe();
};
//clicks continue shopping button
continueShopping.addEventListener("click", addHidden);
modalOverlay.addEventListener("click", addHidden);
//clicks checkout button
checkout.addEventListener("click", function () {
  nameValidation();
  emailValidation();
  telValidation();
  if (nameValidation() && emailValidation() && telValidation()) {
    payWithPaystack();
    addHidden();
  }
});

// SUMMARY MODAL
summaryBtn.addEventListener("click", function () {
  cartList.forEach(function (cur) {
    const cartIndex = cur.index;
    shopSection.querySelectorAll(".items").forEach(function (ev) {
      if (ev.dataset.index == cartIndex) {
        const btn = ev.querySelector("button");
        addDisplay(btn);
      }
    });
  });

  cartList = [];
  setLocalStorage();
  summary.classList.add("hidden");
  updateCartItemsNo();
});
// LOCAL STORAGE
function setLocalStorage() {
  localStorage.setItem("cartList", JSON.stringify(cartList));
}
function getLocalStorage() {
  const localItem = JSON.parse(localStorage.getItem("cartList"));
  if (!localItem) return;
  cartList = localItem;
}

//page reloads or refresh
window.addEventListener("load", function () {
  //get stored browser
  getLocalStorage();
  //update button display for shop section according to cart List
  cartList.forEach(function (cur) {
    const cartIndex = cur.index;
    shopSection.querySelectorAll(".items").forEach(function (ev) {
      if (ev.dataset.index == cartIndex) {
        const btn = ev.querySelector("button");
        removeDisplay(btn);
      }
    });
  });
  //update cart length
  updateCartItemsNo();
});
//385
