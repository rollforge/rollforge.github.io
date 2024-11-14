//---------------------------- Script para funcionamento da barra de navegação do menu mobile

const menumobile = document.querySelector(".menumobile");
const nav = document.querySelector(".nav");// const listitem = document.querySelector(".navlist");

menumobile.addEventListener("click", () => nav.classList.toggle("active"));
