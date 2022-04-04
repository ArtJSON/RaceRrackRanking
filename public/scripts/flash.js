const flash = document.querySelector(".flash");

if (flash) {
  const btn = document.querySelector(".flash .btn-close");

  setTimeout(() => {
    flash.classList.add("flash-disappear");
    flash.addEventListener("transitionend", () => {
      flash.parentElement.removeChild(flash);
    });
  }, 2000);

  btn.addEventListener("click", () => {
    flash.classList.add("flash-disappear");
    flash.addEventListener("transitionend", () => {
      flash.parentElement.removeChild(flash);
    });
  });
}
