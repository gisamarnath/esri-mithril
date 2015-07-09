(function() {

    'use strict';

    var popup = null;

    /**
     * Application wide popup
     * @type {Object}
     */
    em.component.Popup = {
        show : function () {
            if (popup === null) {
                popup = $('#em-modal');
            }

            popup.modal('show');
        },

        hide : function () {
            popup.modal('hide');
        },

        controller: function () {
            var that = this;
            var config = em.config.popup;

            this.type = config.type;
            this.title = config.title;
            this.tag = config.tag;
            this.warning = config.warning;

            this.save = function (e) {
                if (that.type() === 'auth') {
                    var username = document.getElementById('authusername');
                    var password = document.getElementById('authpassword');

                    if (username.value && password.value) {
                        publish('popup.save', [username.value, password.value]);

                        username.parentNode.className = 'form-group';
                        password.parentNode.className = 'form-group';
                    }

                    if (!username.value) {
                        username.parentNode.className = 'form-group has-error';
                    }

                    if (!password.value) {
                        password.parentNode.className = 'form-group has-error';
                    }
                }
            };

            return this;
        },

        view: function (ctrl) {
            var body;
            switch (ctrl.type()) {
                case 'auth' : 
                    body = [ 
                        m('h4', ctrl.tag()),
                        m('div', { class : ctrl.warning() ? 'alert.alert-warning' : 'hidden' } , ctrl.warning()),
                        m('form', [
                            m('div.form-group', [
                                m('label.control-label', 'Username'),
                                m('input[type=text]#authusername.form-control')
                            ]),
                            m('div.form-group', [
                                m('label.control-label', 'Password'),
                                m('input[type=password]#authpassword.form-control')
                            ])
                        ])
                    ];
                    break;
                default :
                    body = m('p', 'One configurable body');
                    break;
            }

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
                        m('h4.modal-title', ctrl.title())
                    ]),
                    m('div.modal-body', body),
                    m('div.modal-footer',
                        m('button.btn.btn-default', { type : 'button', 'data-dismiss' : 'modal' }, 'Close'),
                        m('button.btn.btn-primary', { type : 'button', onclick : ctrl.save }, 'Save')
                    )
                )
            );
        }
    };

})();
