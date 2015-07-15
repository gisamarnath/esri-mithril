/**
 * @return {}
 */
(function() {

    'use strict';

    function generateGroupLayer(info) {
        var subs = [];

        if (!info.subLayers) {
            return info.legend.legend.map(function (lgnd) {
                return m('li.list-group-item', [
                    m('img', { src : 'data:' + lgnd.contentType + ';base64,' + lgnd.imageData }),
                    m('span', lgnd.label || info.name || 'N/A')
                ]);
            });
        }

        for (var ii = 0; info.subLayers && ii < info.subLayers.length; ii++) {
            subs.push(generateGroupLayer(info.subLayers[ii]));
        }

        return m('ul.list-group', subs);
    }
        
    em.component.GroupLayer = {

        controller: function (args) {
            var that = this;

            this.item = m.prop(args.item);
            this.info = m.prop(args.info);

            console.log(args);
    
            return this;
        },
    
        view: function (ctrl, args) {
            return m('ul.list-group', generateGroupLayer(ctrl.info()));
        }
    };

})();
