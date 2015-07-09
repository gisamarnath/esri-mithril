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
    em.util.addLayer = function (layer, label, legend, visible, expanded) {
        if (!layer) {
            console.log('layer is required for em.util.addLayer');
            return;
        }

        if (!label) {
            console.log('label is required for em.util.addLayer');
            return;
        }

        if (!legend) {
            console.log('legend is required for em.util.addLayer');
            return;
        }

        em.vm.layers().push({
            label : label || 'N/A',
            layer : layer,
            legend : legend,
            visible : visible || false,
            expanded : expanded || false
        });
    };

    em.util.getLegend = function (l, token, callback) {
        m.request({ method : 'GET', url : l.url + '/legend?f=json', data : {token:token} })
        .then(function (e) {
            if (e.error) {
                console.log(e);
                return;
            }

            // Add the -1 so when all other layers are removed it's not
            // and empty array which would show all layers
            var visibleLayers = [-1];

            e.layers.forEach(function (layer, idx) {
                layer.visible = true;
                layer.expanded = l.expanded;

                visibleLayers.push(layer.layerId);
            });

            callback(e, visibleLayers);
        });
    };

})();
