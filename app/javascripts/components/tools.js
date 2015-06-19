(function() {

    "use strict";

    em.Tools = {
        controller: function (args) {
            var that = this;

            return this;
        },

        view: function (ctrl, args) {
            return m('div', [
                m.component(em.ComponentHeader, { back : args.back, title : 'Tools' }),
                m('span', 'Tools')
            ]);
        }
    };

})();
