(function() {

    "use strict";

    var config = {
        layers: [
            { value : 'Streets', label : 'Streets', active : true},
            { value : 'Topographic', label : 'Topographic', active : false},
            { value : 'NationalGeographic', label : 'National Geographic', active : false},
            { value : 'Oceans', label : 'Oceans', active : false},
            { value : 'Gray', label : 'Gray', active : false},
            { value : 'DarkGray', label : 'Dark Gray', active : false},
            { value : 'Imagery', label : 'Imagery', active : false},
            { value : 'ShadedRelief', label : 'Shaded Relief', active : false},
            { value : 'Terrain', label : 'Terrain', active : false},
        ]
    };

    em.Basemaps = {
        controller: function (args) {
            var that = this;
            this.layers = m.prop(config.layers);

            this.changebasemap = function (e) {

                if (em.vm.basemap()) {
                    em.map.removeLayer(em.vm.basemap());
                }

                var clicked_value = e.target.getAttribute('data-value');

                var lyr;
                for (var ii = 0; ii < that.layers().length; ii++) {
                    lyr = that.layers()[ii];
                    lyr.active = lyr.value === clicked_value;
                }

                em.vm.basemap(L.esri.basemapLayer(clicked_value));
                em.map.addLayer(em.vm.basemap());
            };

            return this;
        },

        view: function (ctrl, args) {
            return m('div#basemaps', [
                m.component(em.ComponentHeader, { back : args.back, title : 'Basemaps' }),
                m('div', [
                    m('ul', {class : 'nav nav-pills nav-stacked' }, 
                        ctrl.layers().map(function (layer) {
                            return m('li', {class : layer.active ? 'active' : ''}, 
                                m('a', { onclick : ctrl.changebasemap, 'data-value' : layer.value }, layer.label )
                            );
                        })
                    )
                ])
            ]);
        }
    };

})();
