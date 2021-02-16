"use strict";

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

//SHOOPING CART MODAL
cartContainer.addEventListener("click", function () {
  shoppingModal.classList.remove("hidden");
  modalOverlay.classList.remove("hidden");
});
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
continueShopping.addEventListener("click", addHidden);
modalOverlay.addEventListener("click", addHidden);

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
    nameField.style.border = "1px solid green";
    Error1.textContent = "";
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
checkout.addEventListener("click", function () {
  nameValidation();
  emailValidation();
  telValidation();
});
