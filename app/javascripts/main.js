// app namespace
var em = {
    component : {},

    config : {
        layers : [
            {
                label : 'Geology',
                url : 'http://sampleserver5.arcgisonline.com/arcgis/rest/services/Energy/Geology/MapServer',
                type : 'ms',
                visible : false,
                expanded : false
            },
            {
                label : 'USA',
                url : 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
                type : 'ms',
                visible : false,
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
        var map = L.map('map', { 
            // center: [36.165500, -86.784721], // nashville
            center: [37.817764, -122.392181], // san fran
            zoom: 9,
            zoomControl: false
        });

        em.map = map;

        var menu = document.getElementById('menu');
        var menu_container = document.getElementById('menu-container');

        em.resize = function () {
            menu.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
            menu_container.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
        };

        document.getElementById('menu-show').className = window.innerWidth < 768 ? 
            'menu-collapser hide' : 
            '';

        em.map.addLayer(em.vm.basemap());

        window.addEventListener("resize", em.resize, true);
        em.resize();

        init();
    }

    function init() {

        em.config.layers.forEach(function (l, idx) {
            // only retrieve legends for default visible layers
            // if (l.visible !== true) {
            //     return;
            // }
            
            m.request({ method : 'GET', url : l.url + '/legend?f=json' })
            .then(function (e) {
                // Add the -1 so when all other layers are removed it's not
                // and empty array which would show all layers
                var visibleLayers = [-1];
                var lyr;

                lyr = l.visible === true ?
                    L.esri.dynamicMapLayer(l.url, { opacity: 0.5, layers : visibleLayers }).addTo(em.map) :
                    L.esri.dynamicMapLayer(l.url, { opacity: 0.5, layers : visibleLayers });

                e.layers.forEach(function (layer, idx) {
                    layer.visible = l.visible;
                    layer.expanded = l.expanded;
                    visibleLayers.push(layer.layerId);
                });

                em.vm.layers().push({
                    label : l.label,
                    layer : lyr,
                    visibleLayers : visibleLayers,
                    legend : e,
                    visible : m.prop(l.visible),
                    expanded : m.prop(l.expanded)
                });
            });
        });
    }

    $(appstart);
})();