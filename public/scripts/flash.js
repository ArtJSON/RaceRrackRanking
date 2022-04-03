const flash = document.querySelector(".flash");
const btn = document.querySelector(".flash .btn-close");

console.log("dasdsa");

btn.addEventListener("click", () => {
  flash.classList.add("flash-disappear");
  flash.addEventListener("transitionend", () => {
    flash.parentElement.removeChild(flash);
  });
});
