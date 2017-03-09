document.addEventListener("DOMContentLoaded", function()
{
  var canvas = document.querySelector("#fireflies");

  var _fireflies = fireflies
  ({
    canvas: canvas,
    autoRender: true,
    population: 100,
    minRadius: 3,
    maxRadius: 10
  });
});