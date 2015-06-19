(function() {

    "use strict";

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
