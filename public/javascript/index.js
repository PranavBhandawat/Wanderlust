let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (info of taxInfo) {
    if (info.style.display != "inline") {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
});

let leftArrow = document.getElementById("left-arrow");
let rightArrow = document.getElementById("right-arrow");
let filterList = document.getElementById("filter-list");

function getScrollAmount() {
  // true when the viewport is 576px or narrower
  const isSmallScreen = window.matchMedia("(max-width: 576px)").matches;
  return isSmallScreen ? 100 : 300;
}

leftArrow.addEventListener("click", () => {
  filterList.scrollBy({
    left: -getScrollAmount(),
    behavior: "smooth",
  });
});

rightArrow.addEventListener("click", () => {
  filterList.scrollBy({
    left: getScrollAmount(),
    behavior: "smooth",
  });
});

const conciergeText = document.getElementById("conciergeText");
const conciergeToggle = document.getElementById("conciergeToggle");

if (conciergeText && conciergeToggle) {
    if (conciergeText.scrollHeight <= conciergeText.clientHeight) {
        conciergeToggle.style.display = "none";  // nothing to expand
    }
    conciergeToggle.addEventListener("click", () => {
        conciergeText.classList.toggle("clamped");
        conciergeToggle.textContent =
            conciergeText.classList.contains("clamped") ? "Show more" : "Show less";
    });
}
