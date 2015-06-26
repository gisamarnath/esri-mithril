(function() {

    "use strict";

    em.Layers = {
        controller: function (args) {
            var that = this;
            this.layers = em.vm.layers;

            console.log(this.layers());

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

            function _toggleLayerVisibility(layer, layerIds, visible) {
                var visibleLayers = layer.getLayers();

                if (visible === false) {
                    layerIds.forEach(function (layerId, idx) {
                        layerId = visibleLayers.indexOf(layerId);
                        
                        if (layerId >= 0) {
                            visibleLayers.splice(layerId, 1);
                        }
                    });
                }
                else {
                    visibleLayers = visibleLayers.concat(layerIds);
                }

                layer.setLayers(visibleLayers);
            }

            this.toggleLayerVisibility = function (e) {
                // 'this' hasOwnProperty item and legendLayer
                var visibleLayers = this.item.layer.getLayers();
                var idx = visibleLayers.indexOf(this.legendLayer.layerId);

                if (idx !== -1) {
                    this.legendLayer.visible = false;
                }
                else {
                    this.legendLayer.visible = true;

                    // if the service layer is hidden then we need to show it
                    // and add it to the map
                    if (this.item.visible !== true) {
                        this.item.visible = true;

                        if (em.map.hasLayer(this.item.layer) !== true) {
                            em.map.addLayer(this.item.layer);
                        }
                    }
                }

                _toggleLayerVisibility(this.item.layer, [this.legendLayer.layerId], this.legendLayer.visible);

                e.preventDefault();
            };

            this.toggleLayerExpanded = function (e) {
                this.expanded = !this.expanded;

                e.preventDefault();
            };

            function toggleSubLayers(item, expanded) {
                if (item.expanded === false && expanded === true) {
                    item.expanded = true;
                }

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

            this.showAll = function (e) {
                var visibleLayers = [];

                // if the service layer is hidden then we need to show it
                // and add it to the map
                if (this.visible !== true) {
                    this.visible = true;

                    if (em.map.hasLayer(this.layer) !== true) {
                        em.map.addLayer(this.layer);
                    }
                }

                this.legend.layers.forEach(function (layer, idx) {
                    layer.visible = true;
                    visibleLayers.push(layer.layerId);
                });

                _toggleLayerVisibility(this.layer, visibleLayers, true);
                e.preventDefault();
            };

            this.hideAll = function (e) {
                var visibleLayers = [];

                this.legend.layers.forEach(function (layer, idx) {
                    layer.visible = false;
                    visibleLayers.push(layer.layerId);
                });

                _toggleLayerVisibility(this.layer, visibleLayers, false);
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
                                            m('li', m('a[href=#]', { onclick : ctrl.collapseAll.bind(item) }, 'Collapse All')),
                                            m('li.divider', { role : 'separator' }),
                                            m('li', m('a[href=#]', { onclick : ctrl.showAll.bind(item) }, 'Show All')),
                                            m('li', m('a[href=#]', { onclick : ctrl.hideAll.bind(item) }, 'Hide All'))
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
                                                        class : (item.visible === false || l.visible === false ?
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
