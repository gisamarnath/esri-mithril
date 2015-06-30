// app namespace
var em = {
    component : {},
    util : {},

    config : {
        layers : [
            {
                label : 'Geology',
                url : 'http://sampleserver5.arcgisonline.com/arcgis/rest/services/Energy/Geology/MapServer',
                visible : false,
                expanded : false
            },
            {
                label : 'USA',
                url : 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
                visible : true,
                expanded : false
            }
        ]
    },

    vm : {
        // current active basemap
        basemap : m.prop(L.esri.basemapLayer("Streets")),

        // { layer : {}, legend : {} }
        layers : m.prop([])
    }
};

(function () {

    function appstart() {
        loadMap();
        appInit();
    }

    function loadMap() {
        var map = L.map('map', { 
            // center: [36.165500, -86.784721], // nashvillecomponent
            center: [37.817764, -122.392181], // san fran
            zoom: 9,
            zoomControl: false,
            attributionControl: false
        });

        // adding a zoomControl after map creation allows us to override the default position
        new L.Control.Zoom({ position: 'topright' }).addTo(map);

        em.map = map;

        em.map.addLayer(em.vm.basemap());
    }

    function appInit() {

        em.config.layers.forEach(function (l, idx) {
            
            m.request({ method : 'GET', url : l.url + '/legend?f=json' })
            .then(function (e) {
                // Add the -1 so when all other layers are removed it's not
                // and empty array which would show all layers
                var visibleLayers = [-1];
                var lyr;

                e.layers.forEach(function (layer, idx) {
                    layer.visible = l.visible;
                    layer.expanded = l.expanded;

                    if (layer.visible === true) {
                        visibleLayers.push(layer.layerId);
                    }
                });

                lyr = l.visible === true ?
                    L.esri.dynamicMapLayer(l.url, { opacity: 0.5, layers : visibleLayers }).addTo(em.map) :
                    L.esri.dynamicMapLayer(l.url, { opacity: 0.5, layers : visibleLayers });

                em.vm.layers().push({
                    label : l.label,
                    layer : lyr,
                    legend : e,
                    visible : l.visible,
                    expanded : l.expanded
                });
            });
        });

        publish("app.start");
    }

    // UI load handler
    subscribe('menu.loaded', function loadUI() {
        var menu = document.getElementById('menu');
        var menu_container = document.getElementById('menu-container');
        var menu_show = document.getElementById('menu-show');

        em.resize = function () {
            console.log('menu resize');
            menu.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
            menu_container.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
        };

        menu_show.className = window.innerWidth < 768 ? 
            'menu-collapser hide' : 
            '';

        window.addEventListener("resize", em.resize, true);
        em.resize();
    });

    $(appstart);
})();