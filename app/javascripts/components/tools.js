(function() {

    "use strict";

    em.component.Tools = {
        controller: function (args) {
            var that = this;
            var modal = null;

            this.modal = function (e) {
                if (modal === null) {
                    modal = $('#em-modal');
                }

                modal.modal('toggle');
            };

            return this;
        },

        view: function (ctrl, args) {
            return m('div', [
                m.component(em.ComponentHeader, { back : args.back, title : 'Tools' }),
                m('button.btn.btn-default', { type : 'button', onclick : ctrl.modal }, 'Modal')
            ]);
        }
    };

})();
