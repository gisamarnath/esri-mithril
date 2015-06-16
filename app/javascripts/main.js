// app namespace
var em = {};

$(function() {
    var map = L.map('map', {
        center: [36.165500, -86.784721],
        zoom: 9,
        zoomControl: false
    });

    L.esri.basemapLayer("Gray").addTo(map);

    var parks = new L.esri.FeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0", {
        style: function () {
          return { color: "#70ca49", weight: 2 };
        }
    }).addTo(map);

    var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";

    parks.bindPopup(function(feature){
        return L.Util.template(popupTemplate, feature.properties);
    });

    var menu_container = document.getElementById('menu');

    em.resize = function () {
        menu_container.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
    };

    window.addEventListener("resize", em.resize, true);
    em.resize();
});