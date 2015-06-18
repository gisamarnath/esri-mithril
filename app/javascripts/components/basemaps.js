(function() {

    "use strict";

    em.Basemaps = {
        controller: function (args) {
            var that = this;

            return this;
        },

        view: function (ctrl, args) {
            return m('div', [
                m.component(em.ComponentHeader, { back : args.back }),
                m('span', 'Basemaps')
            ]);
        }
    };

})();
