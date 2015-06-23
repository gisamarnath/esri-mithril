// app namespace
var em = {
    config : {},
    vm : {
        basemap : m.prop(L.esri.basemapLayer("Streets"))
    }
};

$(function() {
    var map = L.map('map', { 
        // center: [36.165500, -86.784721], // nashville, tn
        center: [37.817764, -122.392181], // san fran
        zoom: 9,
        zoomControl: false
    });

    em.map = map;

    var menu_container = document.getElementById('menu');

    em.resize = function () {
        menu_container.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
    };

    document.getElementById('menu-show').className = window.innerWidth < 768 ? 
        'menu-collapser hide' : 
        '';

    em.map.addLayer(em.vm.basemap());

    window.addEventListener("resize", em.resize, true);
    em.resize();
});