/**
 * @return {}
 */
(function() {

    'use strict';
        
    em.component.Layers = {
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
                // 'this' hasOwnProperty item and info
                var visibleLayers = this.parent.layer.getLayers();
                var idx = visibleLayers.indexOf(this.info.id);

                if (idx !== -1) {
                    this.info.visible = false;
                }
                else {
                    this.info.visible = true;

                    // if the service layer is hidden then we need to show it
                    // and add it to the map
                    if (this.parent.visible !== true) {
                        this.parent.visible = true;

                        if (em.map.hasLayer(this.parent.layer) !== true) {
                            em.map.addLayer(this.parent.layer);
                        }
                    }
                }

                _toggleLayerVisibility(this.parent.layer, [this.info.id], this.info.visible);

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

                item.layerInfos.forEach(function (info, idx) {
                    info.expanded = expanded;
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

                this.visible = true;

                if (em.map.hasLayer(this.layer) !== true) {
                    em.map.addLayer(this.layer);
                }

                this.layerInfos.forEach(function (info, idx) {
                    info.visible = true;

                    if (info.subLayerIds === null) {
                        visibleLayers.push(info.id);
                    }
                    else {
                        visibleLayers.join(info.subLayerIds);
                    }
                });

                _toggleLayerVisibility(this.layer, visibleLayers, true);
                e.preventDefault();
            };

            this.hideAll = function (e) {
                this.layer.setLayers([-1]);
                this.visible = false;

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
                                    m('div.pull-right', [
                                        m('div.btn-group.pull-right', [
                                            m('button', 
                                                { 
                                                    onclick : ctrl.toggleServiceVisibility.bind(item),
                                                    class : item.visible ? 'btn btn-primary' : 'btn btn-default'
                                                },
                                                m('span.glyphicon.glyphicon-eye-open')
                                            ),
                                            m('button.btn.btn-default.dropdown-toggle', 
                                                { 'data-toggle' : 'dropdown' }, 
                                                m('span.caret', '')
                                            ),
                                            m('ul.dropdown-menu', [
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
                                    ])
                                ]
                            ),
                            m('div', { style : 'display: ' + (item.expanded === false ? 'none;' : 'block;') },
                                item.layerInfos.map(function (info) {

                                    var legend = null;
                                    var header = [m('span', info.name)];
                                    
                                    var dropdown = [
                                        m('button.btn.btn-default.dropdown-toggle', 
                                            { 
                                                'data-toggle' : 'dropdown',
                                            },
                                            m('span.caret', '')
                                        ),
                                        m('ul.dropdown-menu', [
                                            m('li', m('a[href=#]', 
                                                { onclick : ctrl.toggleLayerExpanded.bind(info) },
                                                (info.expanded === false ? 'Expand' : 'Collapse')))
                                        ])
                                    ];

                                    if (info.subLayers) {
                                        legend = m.component(em.component.GroupLayer, { item : item, info : info });
                                    }
                                    else if (info.legend.legend.length === 1) {
                                        header.unshift(m('img', { 
                                            src : 'data:' + info.legend.legend[0].contentType + ';base64,' + info.legend.legend[0].imageData 
                                        }));
                                        legend = null;
                                        dropdown = null;
                                    }
                                    else {
                                        legend = m('ul.list-group', { style : info.expanded === false ? 'display: none;' : '' }, 
                                            info.legend.legend.map(function (lgnd) {
                                                return m('li.list-group-item', [
                                                    m('img', { src : 'data:' + lgnd.contentType + ';base64,' + lgnd.imageData }),
                                                    m('span', lgnd.label || info.name || 'N/A')
                                                ]);
                                            })
                                        );
                                    }

                                    return m('div.panel.panel-default', [
                                        m('div.panel-heading.clearfix', [
                                            header,
                                            m('div.btn-group.pull-right', [
                                                m('button', 
                                                    { 
                                                        onclick : ctrl.toggleLayerVisibility.bind({ parent : item, info : info }),
                                                        class : (item.visible === false || info.visible === false ? 
                                                            'btn btn-default' : 'btn btn-primary')
                                                    },
                                                    m('span.glyphicon.glyphicon-eye-open')),
                                                dropdown
                                            ])
                                        ]),
                                        legend
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
