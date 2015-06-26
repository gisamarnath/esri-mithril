(function() {

    "use strict";

    em.Layers = {
        controller: function (args) {
            var that = this;
            this.layers = em.vm.layers;

            this.toggleServiceVisibility = function (e) {
                this.visible = !this.visible;

                if (this.visible === false) {
                    em.map.removeLayer(this.layer);
                }
                else {
                    em.map.addLayer(this.layer);
                }

                e.preventDefault();
                e.stopPropagation();
            };

            this.toggleServiceExpanded = function (e) {
                this.expanded = !this.expanded;

                e.preventDefault();
            };

            this.toggleLayerVisibility = function (e) {
                // 'this' hasOwnProperty item and legendLayer
                var idx = this.item.visibleLayers.indexOf(this.legendLayer.layerId);

                if (idx !== -1) {
                    this.legendLayer.visible = false;
                    this.item.visibleLayers.splice(idx, 1);
                }
                else {
                    this.legendLayer.visible = true;
                    this.item.visibleLayers.push(this.legendLayer.layerId);
                }

                this.item.layer.setLayers(this.item.visibleLayers);

                e.preventDefault();
            };

            this.toggleLayerExpanded = function (e) {
                this.expanded = !this.expanded;

                e.preventDefault();
            };

            function toggleSubLayers(item, expanded) {
                item.legend.layers.forEach(function (layer, idx) {
                    layer.expanded = expanded;
                });
            }

            this.expandAll = function (e) {
                toggleSubLayers(this, true);
                e.preventDefault();
            };

            this.collapseAll = function (e) {
                toggleSubLayers(this, false);
                e.preventDefault();
            };

            return this;
        },

        view: function (ctrl, args) {
            return m('div#em-layers', [
                m.component(em.ComponentHeader, { back : args.back, title : 'Layers' }),
                m('div', [
                    ctrl.layers().map(function (item, idx) {
                        return m('div', [
                            m('div.bg-info.clearfix.layer-header', 
                                [
                                    m('h4.inline-block', item.label),
                                    m('div.btn-group.pull-right', [
                                        m('button.btn.btn-default.dropdown-toggle', 
                                            { 'data-toggle' : 'dropdown' },
                                            [
                                                'Options',
                                                m('span.caret', '')
                                            ]
                                        ),
                                        m('ul.dropdown-menu', [
                                            m('li', m('a[href=#]', 
                                                { onclick : ctrl.toggleServiceVisibility.bind(item) },
                                                item.visible === false ? 'Show Layer' : 'Hide Layer')),
                                            m('li', m('a[href=#]', 
                                                { onclick : ctrl.toggleServiceExpanded.bind(item) },
                                                item.expanded === false ? 'Expand' : 'Collapse')),
                                            m('li.divider', { role : 'separator' }),
                                            m('li', m('a[href=#]', { onclick : ctrl.expandAll.bind(item) }, 'Expand All')),
                                            m('li', m('a[href=#]', { onclick : ctrl.collapseAll.bind(item) }, 'Collapse All'))
                                        ])
                                    ])
                                ]
                            ),
                            m('div', { style : 'display: ' + (item.expanded === false ? 'none;' : 'block;') },
                                item.legend.layers.map(function (l) {
                                    return m('div.panel.panel-default', [
                                        m('div.panel-heading.clearfix', [
                                            m('span', l.layerName),
                                            m('div.btn-group.pull-right', [
                                                m('button', 
                                                    { 
                                                        'data-toggle' : 'dropdown',
                                                        class : (l.visible === false ?
                                                            'btn btn-default dropdown-toggle' :
                                                            'btn btn-primary dropdown-toggle')
                                                    },
                                                    m('span.caret', '')
                                                ),
                                                m('ul.dropdown-menu', [
                                                    m('li', m('a[href=#]', 
                                                        { onclick : ctrl.toggleLayerVisibility.bind({ item : item, legendLayer : l }) },
                                                        (l.visible === false ? 'Show Layer' : 'Hide Layer'))),
                                                    m('li', m('a[href=#]', 
                                                        { onclick : ctrl.toggleLayerExpanded.bind(l) },
                                                        (l.expanded === false ? 'Expand' : 'Collapse')))
                                                ])
                                            ])
                                        ]),
                                        m('ul.list-group', { style : l.expanded === false ? 'display: none;' : '' }, 
                                            l.legend.map(function (legend) {
                                                return m('li.list-group-item', [
                                                    m('img', { src : 'data:' + legend.contentType + ';base64,' + legend.imageData }),
                                                    m('span', legend.label || l.layerName || 'N/A')
                                                ]);
                                            })
                                        )
                                    ]);
                                })
                            )
                        ]);
                    })
                ])
            ]);
        }
    };

})();
