(function() {

    "use strict";

    var config = {
        layers : [
            {
                label : 'Geology',
                url : 'http://sampleserver5.arcgisonline.com/arcgis/rest/services/Energy/Geology/MapServer',
                type : 'ms',
                visibile : true
            },
            {
                label : 'USA',
                url : 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
                type : 'ms',
                visibile : false
            }
        ]
    };

    em.Layers = {
        controller: function (args) {
            var that = this;

            return this;
        },

        view: function (ctrl, args) {
            return m('div', [
                m.component(em.ComponentHeader, { back : args.back, title : 'Layers' }),
                m('span', 'Layers')
            ]);
        }
    };

})();
