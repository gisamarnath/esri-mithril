(function() {

    "use strict";

    em.Menu = {
        controller: function (args) {
            var that = this;
            this.component = m.prop('default');

            this.loadComponent = function (e) {
                that.component(e.target.getAttribute('data-component'));
            };

            this.back = function () {
                that.component('default');
            };

            return this;
        },

        view: function (ctrl, args, extras) {
            var top = null;
            switch (ctrl.component()) {
                case 'basemaps' : top = m.component(em.Basemaps, { back : ctrl.back }); break;
                case 'layers' : top = m.component(em.Layers, { back : ctrl.back }); break;
                case 'tools' : top = m.component(em.Tools, { back : ctrl.back }); break;
                default :
                    top = m('div', [
                        m('ul', {class : 'nav nav-pills nav-stacked' }, [
                            m('li', m('a', { 'data-component': 'basemaps', onclick: ctrl.loadComponent }, 'Basemaps' ) ),
                            m('li', m('a', { 'data-component': 'layers', onclick: ctrl.loadComponent }, 'Layers' ) ),
                            m('li', m('a', { 'data-component': 'tools', onclick: ctrl.loadComponent }, 'Tools' ) ),
                        ])
                    ]);
                    break;
            }

            return m('div', [
                top,
                m('#menu-hide.menu-collapser', { onclick : args.collapse }, 
                    m('span', { class : 'glyphicon glyphicon-option-vertical' })
                )
            ]);
        }
    };

})();
