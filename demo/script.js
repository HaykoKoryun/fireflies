document.addEventListener("DOMContentLoaded", function()
{
  var canvas = document.querySelector("#fireflies");

  var foci = [];

  var _fireflies = fireflies
  ({
    canvas: canvas,
    autoRender: true,
    population: 200,
    minRadius: 3,
    maxRadius: 10,
    color: "#cdde0b",
    foci: foci
  });

  var markers = document.querySelector("#markers");

  window.addEventListener("click", function(evt)
  {
    var marker = document.createElement("div");
    marker.classList.add("marker");
    var ring = document.createElement("div");
    ring.classList.add("ring");
    marker.appendChild(ring);

    marker.style.left = evt.clientX - 15 + "px";
    marker.style.top = evt.clientY - 15 + "px";

    markers.appendChild(marker);

    var focus =
    {
      x: evt.clientX,
      y: evt.clientY,
      gravity: 0.001,
      marker: marker
    };

    foci.push(focus);

    setTimeout
    ((function(focus)
    {
      return function()
      {
        foci.splice(foci.indexOf(focus), 1);
        markers.removeChild(focus.marker);
      }
    })(focus),
    10000)
  });
});