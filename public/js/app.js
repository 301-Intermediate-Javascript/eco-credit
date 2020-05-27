'use strict';
console.log('hello');

$('document').ready(() => {

const createAccount = $('#createAccountForm');
const loginForm = $('#loginForm');
const createAccountLink = $('#createAccount');
const loginLink = $('#login');

createAccount.hide();
loginForm.hide();

createAccountLink.on('click', (event) => {
    event.preventDefault();
    createAccount.toggle();
})

loginLink.on('click', (event) =>{
    event.preventDefault();
    loginForm.toggle();
})


})