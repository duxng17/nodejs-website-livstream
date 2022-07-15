document.querySelectorAll(".carousel-item")[0].classList.add("active");
var banner_intro = document.querySelectorAll(".banner_intro");
banner_intro.forEach((e) => {
  e.addEventListener("click", () => {
    var slug = e.getAttribute("alt");
    document.location.replace(slug);
  });
});
