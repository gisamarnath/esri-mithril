/**
 * esri-mithril global namespace
 * @type {Object}
 */
var em = {
    /**
     * global component object
     * @type {Object}
     */
    component : {},

    /**
     * global utility object
     * @type {Object}
     */
    util : {},

    /**
     * global config object
     * @type {Object}
     */
    config : {

        /**
         * global config layers
         * @type {Array}
         */
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
            },
            {
                // user / pass = user1 / user1
                label : 'Auth Test',
                url : 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire_secure_ac/MapServer',
                visible : true,
                expanded : false,
                loginUrl : 'http://sampleserver6.arcgisonline.com/arcgis/tokens/generateToken'
            },
            {
                label : 'Group Test',
                url : 'http://sampleserver5.arcgisonline.com/arcgis/rest/services/Water_Network/MapServer',
                visible : true,
                expanded : false
            }
        ],

        popup : {
            type : m.prop('auth'),
            title : m.prop('Title'),
            tag : m.prop('tag'),
            warning : m.prop('')
        }
    },

    /** global view model */
    vm : {
        // current active basemap
        basemap : m.prop(L.esri.basemapLayer("Streets")),

        /**
         * [
         *     {
         *         label, layer, visible, expanded, layerInfos [
         *             id, max/minScale, name, parentLayerId, legend, subLayerIds, subLayers [
         *                 recursively repeat layer infos object here
         *             ]
         *         ]
         *     }
         * ]
         * @type {Array}
         */
        layers : m.prop([])
    }
};

(function () {
    
    /**
     * Called on dom loaded
     * 
     * @return {}
     */
    function appstart() {
        loadMap();
        loadLayers();

        publish("app.start");
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

    /**
    * Loads map layers located in the layer config
    *
    * Checks each layer to see if the layer requires authentication
    */
    function loadLayers() {
        em.config.layers.forEach(function (l, idx) {
            // if loginUrl is present then the layer needs a token
            if (l.loginUrl) {
                em.auth.init(l, function (token) {
                    em.util.getLayerMetadata(l, token);
                });
            }
            else {
                em.util.getLayerMetadata(l);
            }
        });
    }

    // UI load handler
    subscribe('menu.loaded', function loadUI() {
        var menu = document.getElementById('menu');
        var menu_container = document.getElementById('menu-container');
        var menu_show = document.getElementById('menu-show');

        menu_show.className = window.innerWidth < 768 ? 
            'menu-collapser hide' : 
            '';

        em.resize = function () {
            console.log('menu resize');
            menu.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
            menu_container.setAttribute('style', 'height: ' + window.innerHeight + 'px;');
        };

        window.addEventListener("resize", em.resize, true);
        em.resize();
    });

    $(appstart);
})();
