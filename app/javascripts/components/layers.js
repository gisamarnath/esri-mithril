(function() {

    "use strict";

    em.Layers = {
        controller: function (args) {
            var that = this;
            this.layers = em.vm.layers;

            console.log(this.layers());

            this.layerToggle = function (e) {
                var layer = that.layers()[e.target.getAttribute('data-layer-idx')];

                layer.visible = !layer.visible;

                if (layer.visible === false) {
                    em.map.removeLayer(layer.layer);
                }
                else {
                    em.map.addLayer(layer.layer);
                }

                return false;
            };

            return this;
        },

        view: function (ctrl, args) {
            return m('div#em-layers', [
                m.component(em.ComponentHeader, { back : args.back, title : 'Layers' }),
                m('div', [
                    ctrl.layers().map(function (item, idx) {
                        return m('div', [
                            m('div.bg-info.btn-group', 
                                [   
                                    m('button.btn.btn-default.dropdown-toggle', 
                                        { 'data-toggle' : 'dropdown' },
                                        [
                                            item.label,
                                            m('span.caret', '')
                                        ]
                                    ), 
                                    m('ul.dropdown-menu', [
                                        m('li', m('a[href=#]', 
                                            { onclick : ctrl.layerToggle, "data-layer-idx" : idx }, 
                                            item.visible === false ? 'Show' : 'Hide')
                                        ),
                                        m('li', m('a[href=#]', item.expanded === false ? 'Expand' : 'Collapse'))
                                    ]) 
                                ]
                            ),
                            item.legend.layers.map(function (l) {
                                return m('div.panel.panel-default', [
                                    m('div.panel-heading', [
                                        m('span', l.layerName),
                                        m('button.btn.btn-primary.pull-right.clearfix', l.visible === false ? 'Show' : 'Hide')
                                    ]),
                                    m('ul.list-group', { style : l.expanded === false ? 'display: none;' : '' }, 
                                        l.legend.map(function (legend) {
                                            return m('li.list-group-item', [
                                                m('img', { src : 'data:' + legend.contentType + ';base64,' + legend.imageData }),
                                                m('span', legend.label || '[N/A]')
                                            ]);
                                        })
                                    )
                                ]);
                            })
                        ]);
                    })
                ])
            ]);
        }
    };

})();
