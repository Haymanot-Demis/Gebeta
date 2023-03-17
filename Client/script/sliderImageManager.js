import slideTransition from "./slide_transition.js";
export default function silderImage(images) {
  const slider = document.querySelector(".slider");
  const navigation = document.querySelector("div.navigation-visibility");
  const SVG = `<svg height="20" width="30">
              <polygon
                class="slideSvg"
                points="1,1 29,1 29,15 1,15"
                style="stroke: rgb(255, 255, 255)"
              />
            </svg>`;
  for (let i = 0; i < 3; i++) {
    let images = [
      { name: "name", image: "image1.jpg" },
      { name: "name", image: "image2.jpg" },
      { name: "name", image: "image3.jpg" },
    ];
    let slide = document.createElement("div");
    slide.classList.add("slide");
    if (i == 0) {
      slide.classList.add("active");
    }

    let img = document.createElement("img");
    img.src = "http://127.0.0.1:5500/Client/images/AASTU-2.jpg"; //images[i]?.image;
    img.alt = ""; //images[i]?.object.name;

    let info = document.createElement("div");
    info.classList.add("info");

    let h2 = document.createElement("h2");
    h2.innerText = "H2 header"; //images[i]?.object.name;
    let p = document.createElement("p");

    info.appendChild(h2);
    info.appendChild(p);

    slide.appendChild(img);
    slide.appendChild(info);

    let slideIcon = document.createElement("div");
    slideIcon.classList.add("slide-icon");
    if (i == 0) {
      slideIcon.classList.add("active");
    }
    slideIcon.innerHTML = SVG;

    navigation.appendChild(slideIcon);
    slider.prepend(slide);
  }
  slideTransition();
}
