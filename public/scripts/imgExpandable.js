const imgs = document.querySelectorAll(".img-expandable");

imgs.forEach((img) => {
  img.addEventListener("click", function () {
    // create expanded img
    let imgExpanded = document.createElement("img");
    imgExpanded.src = img.dataset.full;
    imgExpanded.classList.add("img-expanded");

    // create button for closing expanded img
    let btn = document.createElement("btn");
    btn.classList.add("img-expanded-btn");
    btn.textContent = "✕";

    // create container
    let imgExpandedContainer = document.createElement("div");
    imgExpandedContainer.classList.add("img-expanded-container");

    // append elements to the container
    imgExpandedContainer.append(imgExpanded);
    imgExpandedContainer.append(btn);

    // append container to the DOM
    img.parentElement.parentElement.parentElement.append(imgExpandedContainer);

    btn.addEventListener("click", function () {
      imgExpandedContainer.parentElement.removeChild(imgExpandedContainer);
    });
  });
});
