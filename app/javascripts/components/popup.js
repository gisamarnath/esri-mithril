(function() {

    "use strict";

    em.component.Popup = {
        controller: function () {
            var that = this;

            return this;
        },

        view: function (ctrl) {
            return m('div.modal-dialog',
                m('div.modal-content',
                    m('div.modal-header', [
                        m('button.close', 
                            { 
                                'data-dismiss' : 'modal',
                                'aria-label' : 'Close'
                            },
                            m('span', m.trust('&times;'))
                        ),
                        m('h4.modal-title', 'Modal Title')
                    ]),
                    m('div.modal-body',
                        m('p', 'One fine body')
                    ),
                    m('div.modal-footer',
                        m('button.btn.btn-default', { type : 'button', 'data-dismiss' : 'modal' }, 'Close'),
                        m('button.btn.btn-primary', { type : 'button' }, 'Save')
                    )
                )
            );
        }
    };

})();
