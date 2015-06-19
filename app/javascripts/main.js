// app namespace
var em = {
    config : {}
};

$(function() {
    var map = L.map('map', {
        center: [36.165500, -86.784721],
        zoom: 9,
        zoomControl: false
    });

    // Initializing global basemap config object
    em.config.basemap = {
        layer : L.esri.basemapLayer("Gray")
    };

    map.addLayer(em.config.basemap.layer);

    var parks = new L.esri.FeatureLayer("http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Portland_Parks/FeatureServer/0", {
        style: function () {
          return { color: "#70ca49", weight: 2 };
        }
    }).addTo(map);

    em.map = map;

    var popupTemplate = "<h3>{NAME}</h3>{ACRES} Acres<br><small>Property ID: {PROPERTYID}<small>";

    parks.bindPopup(function(feature){
        return L.Util.template(popupTemplate, feature.properties);
    });

    var menu_container = document.getElementById('menu');

    em.resize = function () {
        menu_container.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
    };

    document.getElementById('menu-show').className = window.innerWidth < 768 ? 
        'menu-collapser hide' : 
        '';

    window.addEventListener("resize", em.resize, true);
    em.resize();
});