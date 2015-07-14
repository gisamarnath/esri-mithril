(function () {
    
    'use strict';

    /**
     * Returns domain from url
     * @param  {String}
     * @return {String}
     */
    em.util.getDomainFromUrl = function (url) {
        var tmp = document.createElement('a');
        tmp.href = url;
        return tmp.hostname;
    };

    /**
     * Adds layer to the layers component.
     *
     * Layer, label, and legend are required
     * 
     * @param {L.esri.Layers.DynamicMapLayer}
     * @param {String}
     * @param {Object}
     * @param {Boolean}
     * @param {Boolean}
     */
    em.util.addLayer = function (layer, label, layerInfos, visible, expanded) {
        if (!layer) {
            console.log('layer is required for em.util.addLayer');
            return;
        }

        if (!label) {
            console.log('label is required for em.util.addLayer');
            return;
        }

        if (!layerInfos) {
            console.log('layerInfos is required for em.util.addLayer');
            return;
        }

        em.vm.layers().push({
            label : label || 'N/A',
            layer : layer,
            layerInfos : layerInfos,
            visible : visible || false,
            expanded : expanded || false
        });
    };

    em.util.getLegend = function (url, token, callback) {
        return m.request({ method : 'GET', url : url + '/legend?f=json', data : {token:token} })
        .then(function (e) {
            if (e.error) {
                console.log(e);
                return;
            }

            return e.layers;
        });
    };

    /**
     * Loads an individual layers legend, creates map layer, and adds layer to map
     * 
     * @param  {Object}
     * @param  {String}
     * @return {null}
     */
    em.util.getLayerMetadata = function (config, token) {
        em.util.getLegend(config.url, token)
        .then(function (e) {
            var legend = e;
            
            // Add the -1 so when all other layers are removed it's not
            // and empty array which would show all layers
            var visibleLayers = [-1];

            legend.forEach(function (layer, idx) {
                layer.visible = true;
                layer.expanded = config.expanded;

                visibleLayers.push(layer.layerId);
            });

            var layer = L.esri.dynamicMapLayer(config.url, 
                { 
                    opacity: 0.5, 
                    layers : visibleLayers,
                    token : token || null
                });

            em.auth.addHandler(layer);

            if (config.visible === true) {
                em.map.addLayer(layer);
            }

            // calls ?f=json on layer
            layer.metadata(function(error, metadata) {
                var layerInfos = metadata.layers;
                var layerConfigs = [];

                for (var zz = 0; zz < legend.length; zz++) {
                    var leg = legend[zz];

                    for (var qq = 0; qq < layerInfos.length; qq++) {
                        if (layerInfos[qq].id === leg.layerId) {
                            layerInfos[qq].legend = leg;
                            break;
                        }
                    }
                }

                while (layerInfos.length > 0) {
                    var linfo = layerInfos.shift();

                    layerConfigs.push(linfo);

                    if (linfo.subLayerIds === null) {
                        continue;
                    }

                    populateLayerInfos(linfo, layerInfos);
                }

                em.util.addLayer(layer, config.label, layerConfigs, config.visible, config.expanded);
            });
        });
    };

    function populateLayerInfos(l, layerInfos) {
        l.subLayers = [];

        for (var sub = 0; sub < l.subLayerIds.length; sub++) {
            for (var ii = 0; ii < layerInfos.length; ii++) {
                
                if (l.subLayerIds[sub] !== layerInfos[ii].id) {
                    continue;
                }

                var subLayer = layerInfos.splice(ii, 1)[0];

                if (subLayer.subLayerIds !== null) {
                    populateLayerInfos(subLayer, layerInfos);
                }

                l.subLayers.push(subLayer);
            }
        }
    }

})();
