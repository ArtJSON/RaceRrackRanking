const imgs = document.querySelectorAll(".img-expandable");

imgs.forEach((img) => {
  img.addEventListener("click", function () {
    let fullImg = document.createElement("img");
    fullImg.src =
      "https://res.cloudinary.com/dixadtjff/image/upload/c_fill,h_600,w_800/v1648921468/racetracks/ylkhk9fhkuf97oacilw2.jpg".replace(
        /(?<=upload).(?:(?!\/).)*\//g,
        "/"
      );
    fullImg.classList.add("img-expanded");
    img.parentElement.parentElement.parentElement.append(fullImg);
  });
});
