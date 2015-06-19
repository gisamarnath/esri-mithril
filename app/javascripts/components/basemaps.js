(function() {

    "use strict";


    var config = {
        layers: [
            { value : 'Streets', label : 'Streets'},
            { value : 'Topographic', label : 'Topographic'},
            { value : 'NationalGeographic', label : 'National Geographic'},
            { value : 'Oceans', label : 'Oceans'},
            { value : 'Gray', label : 'Gray'},
            { value : 'DarkGray', label : 'Dark Gray'},
            { value : 'Imagery', label : 'Imagery'},
            { value : 'ShadedRelief', label : 'Shaded Relief'},
            'Terrain'
        ]
    };

    em.Basemaps = {
        controller: function (args) {
            var that = this;
            var layer = em.config.basemap.layer;

            this.changebasemap = function (e) {
                if (layer) em.map.removeLayer(layer);

                layer = L.esri.basemapLayer(e.target.getAttribute('data-value'));
                em.map.addLayer(layer);
            };

            return this;
        },

        view: function (ctrl, args) {
            return m('div', [
                m.component(em.ComponentHeader, { back : args.back, title : 'Basemaps' }),
                m('div', [
                    m('ul', {class : 'nav nav-pills nav-stacked' }, 
                        config.layers.map(function (layer) {
                            return m('li', 
                                m('a', { onclick : ctrl.changebasemap, 'data-value' : layer.value }, layer.label )
                            );
                        })
                    )
                ])
            ]);
        }
    };

})();
