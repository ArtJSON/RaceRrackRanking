const imgs = document.querySelectorAll(".img-expandable");

imgs.forEach((img) => {
  img.addEventListener("click", function () {
    console.log("hello");
  });
});
